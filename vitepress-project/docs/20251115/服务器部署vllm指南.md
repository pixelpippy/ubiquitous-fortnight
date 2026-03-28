
# 服务器部署 vLLM 指南

> 适合 A6000 48GB 显存级 GPU，快速搭建大语言模型推理环境  
> 已测试环境：Ubuntu 22.04 / CUDA 12.6 / A6000（48GB）

## 1. 背景

[vLLM](https://github.com/vllm-project/vllm) 是目前最高效的开源 LLM 推理框架之一，支持 PagedAttention、连续批处理、多种量化方式，特别适合部署 7B~70B 参数的模型。  
本文档提供一套我们在 **A6000** 上验证通过的安装流程，可避免常见的 CUDA 版本、torch 依赖冲突问题。

## 2. 环境准备

### 2.1 检查 GPU 与驱动

```bash
nvidia-smi
```

- 确认 CUDA 版本 ≥ 12.0（本流程基于 CUDA 12.6）
- 驱动版本建议 ≥ 535

### 2.2 安装 Miniconda

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
# 按提示完成，重启终端或 source ~/.bashrc
```

## 3. 安装 vLLM

```bash
# 创建 Python 3.12 环境
conda create -n vllm python=3.12 -y
conda activate vllm

# 安装 uv（更快的 pip 替代工具）
pip install --upgrade uv

# 安装 vLLM，指定 torch 后端为 CUDA 12.6
uv pip install vllm --torch-backend=cu126
```

> `--torch-backend=cu126` 会自动安装与 CUDA 12.6 匹配的 PyTorch 版本，避免手动解决 torch 与 vLLM 的兼容性问题。

## 4. 验证安装

```bash
python -c "import vllm; print(vllm.__version__)"
```

若无报错，输出类似 `0.6.3.post1` 即成功。

## 5. 快速启动一个模型（测试）

以 `Qwen2.5-7B-Instruct` 为例：

```bash
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-7B-Instruct \
    --dtype auto \
    --max-model-len 4096 \
    --tensor-parallel-size 1 \
    --port 8000
```

- `--dtype auto`：自动选择 FP16/BF16
- `--max-model-len`：根据显存调整，A6000 48GB 可设 8192
- `--tensor-parallel-size`：单卡设为 1，多卡按需增加

访问 `http://<服务器IP>:8000/v1/models` 检查服务是否正常。

## 6. 常见问题与解决

### 6.1 CUDA 版本不匹配

**现象**：  
`RuntimeError: CUDA error: no kernel image is available for execution on the device`

**解决**：  
重新安装时明确指定 `--torch-backend`，或手动安装对应 CUDA 版本的 PyTorch：

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126
```

### 6.2 显存不足（OOM）

**解决**：  
- 降低 `--max-model-len`
- 开启量化：`--quantization awq` 或 `--quantization gptq`
- 使用 `--enforce-eager` 减少显存碎片（牺牲部分性能）

### 6.3 端口被占用

```bash
lsof -i:8000
kill -9 <PID>
```

### 6.4 模型下载慢

设置 HuggingFace 镜像：

```bash
export HF_ENDPOINT=https://hf-mirror.com
```

## 7. 多卡部署示例（A6000 × 2）

```bash
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-14B-Instruct \
    --tensor-parallel-size 2 \
    --dtype auto \
    --port 8000
```

## 8. 附：一键安装脚本

将以下内容保存为 `setup_vllm.sh`：

```bash
#!/bin/bash
conda create -n vllm python=3.12 -y
conda activate vllm
pip install --upgrade uv
uv pip install vllm --torch-backend=cu126
echo "vLLM 安装完成，使用 conda activate vllm 激活环境"
```

运行：

```bash
chmod +x setup_vllm.sh
./setup_vllm.sh
```

---

有任何问题欢迎在群里交流，祝大家推理飞快
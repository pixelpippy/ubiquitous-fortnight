# Linux使用clash指南

有时候我们需要在Linux系统上使用clash来科学上网，下面是我在Linux系统上使用clash的一个简单指南，主要是基于mihomo这个clash的linux版本来进行的。

## 下载和安装

非图形化界面使用mihomo（https://github.com/MetaCubeX/mihomo）

然后在[release页面](https://github.com/MetaCubeX/mihomo/releases)找到Assets下面的安装包，下载任意版本（一般最新版）的linux安装包，文件名形如[mihomo-linux-amd64-v1.19.21.gz](https://github.com/MetaCubeX/mihomo/releases/download/v1.19.21/mihomo-linux-amd64-v1.19.21.gz)，就下载这个版本的也行。

需要注意的是安装包文件名需要包含**linux**还有**amd64**，我一开始没看清楚，下载成了mihomo-linux-**arm64**，注意啊，一字个字母之差，因为我是amd64平台的机器，我无法执行这个arm64平台的安装包。（这里说明一下99%的系统和平台都是amd64，直接按照我这个下载就行）

```bash
这是我的错误示例，可以不用管，因为我这个下载的mihomo版本错了
./mihomo -d .
bash: ./mihomo: 无法执行二进制文件：可执行文件格式错误
```

可以先在自己本地浏览器下载下来，linux能连上github的话也可以直接使用如下命令下载

```bash
# 首先创建一个新目录用来放安装包和后续的配置文件
cd ~/mihomo

# 使用wget命令下载安装包（根据自己情况选择最新版本和对应的设备平台，amd64还是arm64）
wget "https://github.com/MetaCubeX/mihomo/releases/download/v1.19.21/mihomo-linux-amd64-v1.19.21.gz"
# 解压并替换
gzip -d mihomo-linux-amd64-v1.19.21.gz
mv mihomo-linux-amd64-v1.19.21.gz mihomo
chmod +x mihomo	# 增加可执行权限
```

接下来需要去机场把订阅的**config.yaml**文件下载下来，继续执行

```bash
 wget -O config.yaml "你的机场的订阅地址"
```

然后下载3个必要文件，分别是

```
https://cdn.jsdelivr.net/gh/Dreamacro/maxmind-geoip@release/Country.mmdb
https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat
https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.dat
```

把这三个文件下载好了，都放在~/mihomo文件夹下面

## 使用

执行命令启动mihomo

```bash
# 后面参数的“-d .”的意思告诉它，配置文件config.yaml在~/mihomo这个目录下面
./mihomo -d .
```

这一步的启动参数还可以自定义（可选）

```bash
-d 或者 --directory	#指定工作目录（读取配置文件的目录）
-f 或者 --config	#指定配置文件路径
-ext-ctl	#指定外部控制器地址
-t 或者 --test	#测试配置文件是否正确
```

比如有两个配置文件，就可以使用（可选）

```bash
./mihomo -d . -f /mihomo/config2.yaml	#路径填写自己实际的
```

看到这些输出就代表可以了

```
INFO[2026-03-25T19:21:21.165579436+08:00] Start initial configuration in progress      
INFO[2026-03-25T19:21:21.187990697+08:00] Geodata Loader mode: memconservative         
INFO[2026-03-25T19:21:21.188027142+08:00] Geosite Matcher implementation: succinct     
WARN[2026-03-25T19:21:21.188770012+08:00] replace fallback-filter.geosite with nameserver-policy, it will be removed in the future 
INFO[2026-03-25T19:21:21.188808886+08:00] Load GeoSite rule: cn                        
INFO[2026-03-25T19:21:21.722585808+08:00] Load GeoSite rule: gfw                       
INFO[2026-03-25T19:21:21.768048849+08:00] Finished initial GeoSite rule gfw => dns.fallback-filter.geosite, records: 4185 
INFO[2026-03-25T19:21:21.768157418+08:00] Initial configuration complete, total time: 602ms 
INFO[2026-03-25T19:21:21.768753052+08:00] RESTful API listening at: 127.0.0.1:9090     
INFO[2026-03-25T19:21:21.775949809+08:00] Sniffer is closed                            
INFO[2026-03-25T19:21:21.776358595+08:00] Mixed(http+socks) proxy listening at: [::]:7890 
INFO[2026-03-25T19:21:21.776469954+08:00] Start initial compatible provider default    
INFO[2026-03-25T19:21:21.776515369+08:00] Start initial compatible provider 自动选择       
INFO[2026-03-25T19:21:21.776479735+08:00] Start initial compatible provider 故障转移
。。。。
```

然后再打开一个终端，旧终端不能关上

新终端需要输入的环境变量

```
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
```

然后就可以在新终端中使用代理了

可以在新终端检测一下

```
curl -I https://www.google.com
```

如果显示如下，就说明成功了

```
HTTP/1.1 200 Connection established
```

## 管理

使用本地电脑的浏览器网页进行节点的选择

首先因为web界面在127.0.0.1:9090，这是个本机地址，意思是只有服务器本身访问这个地址能看到网页，本地电脑是看不到的，这个时候就需要进行ssh的端口转发

#### 方式一（最简单）

如果你同时使用vscode进行远程连接，那么可以直接用vscode的端口转发功能

点开vscode终端，可以看到终端上面一排依次有“问题，输出，调试控制台，终端，端口”

点开端口，点击转发端口，输入9090，然后回车。就默认把将服务器的 9090 端口转发到本地 9090了

然后用浏览器打开网页

```
https://yacd.metacubex.one/
```

#### 方式二（更轻量）

打开cmd，在终端中输入

```bash
# 将服务器的 9090 端口转发到本地 9090
ssh -L 9090:localhost:9090 用户名@服务器IP
```

然后输入密码连接成功之后，然后保持终端开启

用浏览器打开网页

```
https://yacd.metacubex.one/
```
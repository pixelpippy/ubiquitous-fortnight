# Linux安全运维手册

> 记录 Linux 服务器安全加固、日志监控、入侵检测等实用技巧，前段时间学校的服务器被挖坑病毒攻击了，导致服务器被挖矿程序占满资源，无法正常使用。为了防止类似事件再次发生，我总结了一些 Linux 安全运维的实用方法和工具，希望能帮助大家提升服务器的安全性。

## 安装Fail2Ban

本质上是一个**日志监控 + 自动封 IP 的工具**，它盯着系统日志，发现某个 IP 短时间内登录失败太多次，就调用防火墙把这个 IP 封掉。

工作流程

```
SSH 登录失败
      ↓
写入 /var/log/auth.log
      ↓
Fail2Ban 持续监控日志
      ↓
发现同一 IP 失败次数超过 maxretry
      ↓
调用 UFW/iptables 封禁该 IP
      ↓
封禁时间到期后自动解封
```

### 安装和配置

```bash
# 安装
sudo apt install fail2ban

# Fail2Ban 有两个配置文件
# jail.conf      → 默认配置，不要直接改（软件更新会覆盖）
# jail.local     → 你的自定义配置，优先级更高

# 创建自定义配置文件
# 使用这个命令就行
sudo vim /etc/fail2ban/jail.local
```

### 写入以下内容

```ini
[DEFAULT]
# 白名单，这些 IP 永远不会被封（填你自己常用的 IP）
# 这个我没设置，因为ip可能会变
# ignoreip = 127.0.0.1/8 ::1

# 封禁时长，单位秒，600 = 10分钟，-1 = 永久封禁
bantime = 600

# 检测时间窗口，10分钟内
findtime = 600

# 窗口内失败几次触发封禁
# 次数设置多一点，防止误封普通用户
# maxretry = 5
maxretry = 10

[sshd]
enabled = true
port = 22
```

```bash
# 启动并设置开机自启
sudo systemctl enable --now fail2ban

# 查看运行状态
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

### 日常管理命令

~~~bash
# 查看当前被封的 IP
sudo fail2ban-client status sshd

# 手动解封某个 IP（比如自己不小心被封了）
sudo fail2ban-client set sshd unbanip 1.2.3.4

# 手动封禁某个 IP
sudo fail2ban-client set sshd banip 1.2.3.4

# 查看日志，能看到封禁记录
sudo tail -f /var/log/fail2ban.log
```

---

## 日志样例
```
2026-03-22 10:23:01 WARNING [sshd] Ban 1.2.3.4
2026-03-22 10:23:01 NOTICE  [sshd] 1.2.3.4 已尝试失败 5 次
2026-03-22 11:23:01 NOTICE  [sshd] Unban 1.2.3.4  ← 1小时后自动解封
~~~

## 检查用户登录日志

```
cat /var/log/auth.log
```

检查是否有异常
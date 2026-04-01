# tmux使用常用命令和技巧

tmux是服务器上非常常用的终端复用工具，可以关闭终端在后台继续运行程序，不用担心ssh连接断开。

## 新建会话

第一个启动的 Tmux 窗口，编号是`0`，第二个窗口的编号是`1`，以此类推。这些窗口对应的会话，就是 0 号会话、1 号会话。

```
tmux new -s <session-name>
```

## 分离会话

在 Tmux 窗口中，按下**Ctrl+b**然后按**d**或者输入tmux detach命令

```
tmux detach
```

## 接入会话

```
# 使用会话编号
$ tmux attach -t 0

# 使用会话名称
$ tmux attach -t <session-name>
```

## 删除会话

```
# 使用会话编号
$ tmux kill-session -t 0

# 使用会话名称
$ tmux kill-session -t <session-name>
```

## 不小心变成多窗格

先使用Ctrl+b加箭头，选中不想要的窗格

再关闭当前窗格

```
Ctrl+b 然后按 x
```



## 设置鼠标滚轮设置颜色

如下

## 历史记录长度

将如下命令写入~/.tmux.conf文件，没有就创建一个

```
set -g mouse on
set-option -g history-limit 200000
set-option -g default-terminal "screen-256color"
set-option -g set-clipboard on
```

然后

```
# 重新加载当前的 Tmux 配置
$ tmux source-file ~/.tmux.conf
```


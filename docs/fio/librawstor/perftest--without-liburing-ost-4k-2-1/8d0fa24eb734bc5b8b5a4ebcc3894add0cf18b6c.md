[&lt; back](..)

# perftest--without-liburing-ost-4k-2-1

2026-11-14 06:32:27

refs/heads/worktree-security-design-doc

[8d0fa24](https://github.com/rawstor/librawstor/commit/8d0fa24eb734bc5b8b5a4ebcc3894add0cf18b6c)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15417: Sat Nov 14 06:31:09 2026
  read: IOPS=37.6k, BW=147MiB/s (154MB/s)(1469MiB/10001msec)
    slat (nsec): min=231, max=153141, avg=412.60, stdev=394.89
    clat (usec): min=20, max=879, avg=52.48, stdev=25.01
     lat (usec): min=20, max=879, avg=52.89, stdev=25.01
    clat percentiles (usec):
     |  1.00th=[   28],  5.00th=[   35], 10.00th=[   37], 20.00th=[   40],
     | 30.00th=[   42], 40.00th=[   43], 50.00th=[   45], 60.00th=[   47],
     | 70.00th=[   50], 80.00th=[   56], 90.00th=[   88], 95.00th=[  105],
     | 99.00th=[  143], 99.50th=[  155], 99.90th=[  229], 99.95th=[  302],
     | 99.99th=[  570]
   bw (  KiB/s): min=135536, max=158928, per=100.00%, avg=150480.70, stdev=6220.97, samples=20
   iops        : min=33884, max=39732, avg=37620.05, stdev=1555.27, samples=20
  lat (usec)   : 50=70.29%, 100=23.75%, 250=5.88%, 500=0.07%, 750=0.01%
  lat (usec)   : 1000=0.01%
  cpu          : usr=17.36%, sys=41.39%, ctx=216012, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=376026,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15421: Sat Nov 14 06:31:09 2026
  write: IOPS=4221, BW=16.5MiB/s (17.3MB/s)(165MiB/10001msec); 0 zone resets
    slat (nsec): min=430, max=98338, avg=914.12, stdev=743.37
    clat (usec): min=242, max=25277, avg=472.41, stdev=255.27
     lat (usec): min=242, max=25278, avg=473.32, stdev=255.28
    clat percentiles (usec):
     |  1.00th=[  269],  5.00th=[  285], 10.00th=[  302], 20.00th=[  330],
     | 30.00th=[  359], 40.00th=[  392], 50.00th=[  420], 60.00th=[  486],
     | 70.00th=[  553], 80.00th=[  594], 90.00th=[  652], 95.00th=[  709],
     | 99.00th=[ 1139], 99.50th=[ 1319], 99.90th=[ 1876], 99.95th=[ 2802],
     | 99.99th=[ 5145]
   bw (  KiB/s): min=14800, max=17488, per=100.00%, avg=16893.85, stdev=582.24, samples=20
   iops        : min= 3700, max= 4372, avg=4223.40, stdev=145.53, samples=20
  lat (usec)   : 250=0.05%, 500=61.40%, 750=34.88%, 1000=2.13%
  lat (msec)   : 2=1.45%, 4=0.07%, 10=0.01%, 50=0.01%
  cpu          : usr=2.52%, sys=5.93%, ctx=36364, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,42220,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=147MiB/s (154MB/s), 147MiB/s-147MiB/s (154MB/s-154MB/s), io=1469MiB (1540MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=16.5MiB/s (17.3MB/s), 16.5MiB/s-16.5MiB/s (17.3MB/s-17.3MB/s), io=165MiB (173MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=4/101177, sectors=256/2240544, merge=0/156447, ticks=4/19561, in_queue=19566, util=37.82%
```

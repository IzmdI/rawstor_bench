[&lt; back](..)

# perftest-file-4k-1-1

2026-11-09 20:19:07

refs/heads/add/vhost-live-migration

[91e8ca5](https://github.com/rawstor/librawstor/commit/91e8ca5f7fbbbcbed180eece1290ea53038e75ec)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15435: Mon Nov  9 20:17:55 2026
  read: IOPS=488k, BW=1906MiB/s (1999MB/s)(18.6GiB/10001msec)
    slat (nsec): min=180, max=210317, avg=218.81, stdev=272.42
    clat (nsec): min=1332, max=382937, avg=1682.07, stdev=704.50
     lat (nsec): min=1552, max=383237, avg=1900.88, stdev=756.94
    clat percentiles (nsec):
     |  1.00th=[ 1496],  5.00th=[ 1512], 10.00th=[ 1528], 20.00th=[ 1560],
     | 30.00th=[ 1592], 40.00th=[ 1608], 50.00th=[ 1640], 60.00th=[ 1672],
     | 70.00th=[ 1720], 80.00th=[ 1752], 90.00th=[ 1816], 95.00th=[ 1896],
     | 99.00th=[ 2064], 99.50th=[ 2160], 99.90th=[ 8768], 99.95th=[ 9152],
     | 99.99th=[22400]
   bw (  MiB/s): min= 1809, max= 1962, per=100.00%, avg=1907.39, stdev=36.31, samples=20
   iops        : min=463110, max=502362, avg=488291.00, stdev=9296.46, samples=20
  lat (usec)   : 2=98.35%, 4=1.45%, 10=0.16%, 20=0.03%, 50=0.01%
  lat (usec)   : 100=0.01%, 250=0.01%, 500=0.01%
  cpu          : usr=32.64%, sys=67.34%, ctx=51, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4880467,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15439: Mon Nov  9 20:17:55 2026
  write: IOPS=3030, BW=11.8MiB/s (12.4MB/s)(119MiB/10009msec); 0 zone resets
    slat (nsec): min=321, max=16906, avg=563.31, stdev=381.91
    clat (usec): min=213, max=69458, avg=329.12, stdev=769.63
     lat (usec): min=214, max=69461, avg=329.69, stdev=769.66
    clat percentiles (usec):
     |  1.00th=[  233],  5.00th=[  245], 10.00th=[  253], 20.00th=[  269],
     | 30.00th=[  281], 40.00th=[  293], 50.00th=[  302], 60.00th=[  310],
     | 70.00th=[  322], 80.00th=[  330], 90.00th=[  355], 95.00th=[  404],
     | 99.00th=[  578], 99.50th=[  660], 99.90th=[10552], 99.95th=[14484],
     | 99.99th=[39584]
   bw (  KiB/s): min= 3176, max=13400, per=100.00%, avg=12139.05, stdev=2499.14, samples=20
   iops        : min=  794, max= 3350, avg=3034.70, stdev=624.77, samples=20
  lat (usec)   : 250=8.40%, 500=89.73%, 750=1.58%, 1000=0.13%
  lat (msec)   : 2=0.04%, 4=0.01%, 10=0.01%, 20=0.08%, 50=0.01%
  lat (msec)   : 100=0.01%
  cpu          : usr=0.52%, sys=1.67%, ctx=30338, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,30336,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1906MiB/s (1999MB/s), 1906MiB/s-1906MiB/s (1999MB/s-1999MB/s), io=18.6GiB (20.0GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=11.8MiB/s (12.4MB/s), 11.8MiB/s-11.8MiB/s (12.4MB/s-12.4MB/s), io=119MiB (124MB), run=10009-10009msec

Disk stats (read/write):
  nvme0n1: ios=17/79734, sectors=136/2276168, merge=0/118879, ticks=37/51045, in_queue=51083, util=44.11%
```

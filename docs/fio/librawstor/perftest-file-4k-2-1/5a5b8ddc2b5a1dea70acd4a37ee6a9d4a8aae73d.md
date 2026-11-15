[&lt; back](..)

# perftest-file-4k-2-1

2026-11-15 12:50:15

refs/heads/add/tls

[5a5b8dd](https://github.com/rawstor/librawstor/commit/5a5b8ddc2b5a1dea70acd4a37ee6a9d4a8aae73d)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=16079: Sun Nov 15 12:49:01 2026
  read: IOPS=466k, BW=1818MiB/s (1907MB/s)(17.8GiB/10001msec)
    slat (nsec): min=190, max=54221, avg=248.75, stdev=160.91
    clat (nsec): min=3015, max=99751, avg=3867.91, stdev=660.05
     lat (nsec): min=3245, max=99961, avg=4116.66, stdev=681.81
    clat percentiles (nsec):
     |  1.00th=[ 3472],  5.00th=[ 3568], 10.00th=[ 3600], 20.00th=[ 3664],
     | 30.00th=[ 3728], 40.00th=[ 3760], 50.00th=[ 3792], 60.00th=[ 3856],
     | 70.00th=[ 3920], 80.00th=[ 3952], 90.00th=[ 4048], 95.00th=[ 4128],
     | 99.00th=[ 4768], 99.50th=[ 5664], 99.90th=[12992], 99.95th=[14912],
     | 99.99th=[20096]
   bw (  MiB/s): min= 1802, max= 1826, per=100.00%, avg=1819.60, stdev= 6.51, samples=20
   iops        : min=461384, max=467570, avg=465817.00, stdev=1667.16, samples=20
  lat (usec)   : 4=84.64%, 10=14.97%, 20=0.38%, 50=0.01%, 100=0.01%
  cpu          : usr=32.69%, sys=67.29%, ctx=55, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4655690,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=16088: Sun Nov 15 12:49:01 2026
  write: IOPS=5314, BW=20.8MiB/s (21.8MB/s)(208MiB/10001msec); 0 zone resets
    slat (nsec): min=390, max=57317, avg=1309.67, stdev=957.97
    clat (usec): min=191, max=100151, avg=374.24, stdev=976.70
     lat (usec): min=192, max=100155, avg=375.55, stdev=976.73
    clat percentiles (usec):
     |  1.00th=[  210],  5.00th=[  223], 10.00th=[  233], 20.00th=[  265],
     | 30.00th=[  281], 40.00th=[  297], 50.00th=[  314], 60.00th=[  338],
     | 70.00th=[  363], 80.00th=[  412], 90.00th=[  502], 95.00th=[  578],
     | 99.00th=[  938], 99.50th=[ 1156], 99.90th=[ 6980], 99.95th=[12256],
     | 99.99th=[34341]
   bw (  KiB/s): min= 7224, max=24192, per=100.00%, avg=21268.45, stdev=3731.87, samples=20
   iops        : min= 1806, max= 6048, avg=5317.00, stdev=932.94, samples=20
  lat (usec)   : 250=15.82%, 500=73.90%, 750=8.46%, 1000=1.01%
  lat (msec)   : 2=0.53%, 4=0.09%, 10=0.11%, 20=0.05%, 50=0.02%
  lat (msec)   : 100=0.01%, 250=0.01%
  cpu          : usr=1.05%, sys=5.44%, ctx=56039, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,53150,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=1818MiB/s (1907MB/s), 1818MiB/s-1818MiB/s (1907MB/s-1907MB/s), io=17.8GiB (19.1GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=20.8MiB/s (21.8MB/s), 20.8MiB/s-20.8MiB/s (21.8MB/s-21.8MB/s), io=208MiB (218MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=3/122475, sectors=232/3280520, merge=0/193185, ticks=81/103175, in_queue=103256, util=43.61%
```

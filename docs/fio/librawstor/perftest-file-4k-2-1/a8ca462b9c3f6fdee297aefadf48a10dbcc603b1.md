[&lt; back](..)

# perftest-file-4k-2-1

2026-11-05 21:00:41

refs/heads/main

[a8ca462](https://github.com/rawstor/librawstor/commit/a8ca462b9c3f6fdee297aefadf48a10dbcc603b1)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15518: Thu Nov  5 20:59:58 2026
  read: IOPS=346k, BW=1351MiB/s (1417MB/s)(13.2GiB/10001msec)
    slat (nsec): min=490, max=67877, avg=583.95, stdev=280.73
    clat (nsec): min=3918, max=212920, avg=4975.61, stdev=884.89
     lat (nsec): min=4479, max=213490, avg=5559.56, stdev=938.14
    clat percentiles (nsec):
     |  1.00th=[ 4512],  5.00th=[ 4576], 10.00th=[ 4640], 20.00th=[ 4704],
     | 30.00th=[ 4768], 40.00th=[ 4832], 50.00th=[ 4896], 60.00th=[ 4960],
     | 70.00th=[ 5024], 80.00th=[ 5088], 90.00th=[ 5216], 95.00th=[ 5280],
     | 99.00th=[ 6944], 99.50th=[13504], 99.90th=[15296], 99.95th=[21120],
     | 99.99th=[26752]
   bw (  MiB/s): min= 1324, max= 1381, per=100.00%, avg=1352.50, stdev=14.79, samples=20
   iops        : min=339184, max=353588, avg=346239.35, stdev=3785.02, samples=20
  lat (usec)   : 4=0.01%, 10=99.47%, 20=0.47%, 50=0.06%, 100=0.01%
  lat (usec)   : 250=0.01%
  cpu          : usr=46.46%, sys=53.52%, ctx=62, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3460036,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15522: Thu Nov  5 20:59:58 2026
  write: IOPS=4724, BW=18.5MiB/s (19.4MB/s)(185MiB/10001msec); 0 zone resets
    slat (nsec): min=1042, max=38362, avg=3104.87, stdev=1461.46
    clat (usec): min=218, max=16494, avg=418.74, stdev=353.89
     lat (usec): min=221, max=16499, avg=421.84, stdev=353.84
    clat percentiles (usec):
     |  1.00th=[  262],  5.00th=[  281], 10.00th=[  297], 20.00th=[  318],
     | 30.00th=[  334], 40.00th=[  351], 50.00th=[  371], 60.00th=[  396],
     | 70.00th=[  424], 80.00th=[  478], 90.00th=[  570], 95.00th=[  635],
     | 99.00th=[  840], 99.50th=[ 1205], 99.90th=[ 5407], 99.95th=[ 7373],
     | 99.99th=[15795]
   bw (  KiB/s): min=17600, max=19888, per=100.00%, avg=18908.55, stdev=658.81, samples=20
   iops        : min= 4400, max= 4972, avg=4727.00, stdev=164.67, samples=20
  lat (usec)   : 250=0.32%, 500=82.35%, 750=15.65%, 1000=1.09%
  lat (msec)   : 2=0.30%, 4=0.15%, 10=0.12%, 20=0.03%
  cpu          : usr=4.60%, sys=4.99%, ctx=49238, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,47252,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=1351MiB/s (1417MB/s), 1351MiB/s-1351MiB/s (1417MB/s-1417MB/s), io=13.2GiB (14.2GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=18.5MiB/s (19.4MB/s), 18.5MiB/s-18.5MiB/s (19.4MB/s-19.4MB/s), io=185MiB (194MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=7/113371, sectors=56/2907736, merge=0/177501, ticks=20/18565, in_queue=18585, util=34.29%
```

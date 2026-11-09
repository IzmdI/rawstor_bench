[&lt; back](..)

# perftest--without-liburing-ost-4k-1-1

2026-11-09 20:40:01

refs/heads/main

[c99dace](https://github.com/rawstor/librawstor/commit/c99dacedeb85a64ab4d79b60baee10727dbb73cb)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15466: Mon Nov  9 20:39:22 2026
  read: IOPS=18.3k, BW=71.3MiB/s (74.8MB/s)(713MiB/10001msec)
    slat (nsec): min=390, max=90135, avg=632.29, stdev=441.91
    clat (usec): min=41, max=517, avg=53.64, stdev= 6.92
     lat (usec): min=41, max=519, avg=54.28, stdev= 7.03
    clat percentiles (usec):
     |  1.00th=[   46],  5.00th=[   47], 10.00th=[   47], 20.00th=[   48],
     | 30.00th=[   49], 40.00th=[   50], 50.00th=[   52], 60.00th=[   55],
     | 70.00th=[   57], 80.00th=[   58], 90.00th=[   62], 95.00th=[   68],
     | 99.00th=[   77], 99.50th=[   80], 99.90th=[   90], 99.95th=[   96],
     | 99.99th=[  126]
   bw (  KiB/s): min=67272, max=78248, per=100.00%, avg=73064.85, stdev=3265.14, samples=20
   iops        : min=16818, max=19562, avg=18266.05, stdev=816.33, samples=20
  lat (usec)   : 50=39.83%, 100=60.13%, 250=0.04%, 500=0.01%, 750=0.01%
  cpu          : usr=13.21%, sys=28.06%, ctx=182589, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=182580,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15546: Mon Nov  9 20:39:22 2026
  write: IOPS=2801, BW=10.9MiB/s (11.5MB/s)(110MiB/10028msec); 0 zone resets
    slat (nsec): min=831, max=22273, avg=1859.48, stdev=732.08
    clat (usec): min=238, max=40066, avg=354.02, stdev=636.13
     lat (usec): min=240, max=40069, avg=355.88, stdev=636.16
    clat percentiles (usec):
     |  1.00th=[  253],  5.00th=[  265], 10.00th=[  269], 20.00th=[  285],
     | 30.00th=[  302], 40.00th=[  310], 50.00th=[  318], 60.00th=[  326],
     | 70.00th=[  334], 80.00th=[  347], 90.00th=[  367], 95.00th=[  412],
     | 99.00th=[  791], 99.50th=[ 1516], 99.90th=[ 8586], 99.95th=[16712],
     | 99.99th=[28705]
   bw (  KiB/s): min= 9216, max=12352, per=100.00%, avg=11243.30, stdev=905.24, samples=20
   iops        : min= 2304, max= 3088, avg=2810.70, stdev=226.25, samples=20
  lat (usec)   : 250=0.50%, 500=97.29%, 750=1.14%, 1000=0.36%
  lat (msec)   : 2=0.34%, 4=0.15%, 10=0.14%, 20=0.05%, 50=0.03%
  cpu          : usr=3.08%, sys=5.40%, ctx=28101, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,28098,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=71.3MiB/s (74.8MB/s), 71.3MiB/s-71.3MiB/s (74.8MB/s-74.8MB/s), io=713MiB (748MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=10.9MiB/s (11.5MB/s), 10.9MiB/s-10.9MiB/s (11.5MB/s-11.5MB/s), io=110MiB (115MB), run=10028-10028msec

Disk stats (read/write):
  nvme0n1: ios=6/69461, sectors=48/1564168, merge=0/104578, ticks=8/15241, in_queue=15250, util=33.79%
```

[&lt; back](..)

# perftest--disable-ost-4k-1-1

2025-08-22 22:26:54

refs/heads/main

[eb4dfa5](https://github.com/rawstor/librawstor/commit/eb4dfa59ddc20ea79afe39adacbbe2df88d2c840)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9697: Fri Aug 22 22:26:53 2025
  read: IOPS=33.5k, BW=131MiB/s (137MB/s)(1307MiB/10001msec)
    slat (nsec): min=20, max=15630, avg=40.81, stdev=76.77
    clat (nsec): min=1252, max=125044, avg=3038.80, stdev=2715.72
     lat (nsec): min=1282, max=125104, avg=3079.61, stdev=2721.70
    clat percentiles (nsec):
     |  1.00th=[ 1560],  5.00th=[ 1624], 10.00th=[ 1672], 20.00th=[ 1736],
     | 30.00th=[ 1832], 40.00th=[ 2024], 50.00th=[ 2128], 60.00th=[ 2288],
     | 70.00th=[ 2960], 80.00th=[ 3824], 90.00th=[ 5152], 95.00th=[ 7200],
     | 99.00th=[14400], 99.50th=[18304], 99.90th=[25984], 99.95th=[30848],
     | 99.99th=[69120]
   bw (  KiB/s): min=113176, max=153168, per=99.27%, avg=132892.63, stdev=12784.40, samples=19
   iops        : min=28294, max=38292, avg=33223.16, stdev=3196.10, samples=19
  write: IOPS=33.4k, BW=131MiB/s (137MB/s)(1306MiB/10001msec); 0 zone resets
    slat (nsec): min=29, max=19125, avg=62.78, stdev=101.45
    clat (usec): min=5, max=536, avg=25.96, stdev= 4.14
     lat (usec): min=5, max=536, avg=26.02, stdev= 4.15
    clat percentiles (nsec):
     |  1.00th=[20352],  5.00th=[21376], 10.00th=[21888], 20.00th=[22912],
     | 30.00th=[23680], 40.00th=[24448], 50.00th=[25216], 60.00th=[25984],
     | 70.00th=[26752], 80.00th=[29056], 90.00th=[31104], 95.00th=[32128],
     | 99.00th=[39680], 99.50th=[43264], 99.90th=[48896], 99.95th=[51968],
     | 99.99th=[89600]
   bw (  KiB/s): min=110776, max=150648, per=99.33%, avg=132809.26, stdev=12804.24, samples=19
   iops        : min=27694, max=37662, avg=33202.32, stdev=3201.06, samples=19
  lat (usec)   : 2=19.11%, 4=21.62%, 10=8.11%, 20=1.41%, 50=49.70%
  lat (usec)   : 100=0.04%, 250=0.01%, 500=0.01%, 750=0.01%
  cpu          : usr=7.63%, sys=37.92%, ctx=334239, majf=0, minf=15
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=334706,334291,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=131MiB/s (137MB/s), 131MiB/s-131MiB/s (137MB/s-137MB/s), io=1307MiB (1371MB), run=10001-10001msec
  WRITE: bw=131MiB/s (137MB/s), 131MiB/s-131MiB/s (137MB/s-137MB/s), io=1306MiB (1369MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/276, sectors=0/39464, merge=0/1644, ticks=0/643, in_queue=653, util=0.25%
```

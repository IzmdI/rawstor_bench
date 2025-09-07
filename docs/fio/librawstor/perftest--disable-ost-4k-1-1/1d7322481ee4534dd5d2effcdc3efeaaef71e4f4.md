[&lt; back](..)

# perftest--disable-ost-4k-1-1

2025-09-07 13:57:56

refs/heads/feat/cpp

[1d73224](https://github.com/rawstor/librawstor/commit/1d7322481ee4534dd5d2effcdc3efeaaef71e4f4)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10264: Sun Sep  7 13:57:54 2025
  read: IOPS=32.5k, BW=127MiB/s (133MB/s)(1269MiB/10001msec)
    slat (nsec): min=9, max=16762, avg=47.37, stdev=80.90
    clat (nsec): min=1212, max=172702, avg=3106.26, stdev=2831.71
     lat (nsec): min=1232, max=172793, avg=3153.64, stdev=2839.24
    clat percentiles (nsec):
     |  1.00th=[ 1496],  5.00th=[ 1592], 10.00th=[ 1640], 20.00th=[ 1720],
     | 30.00th=[ 1832], 40.00th=[ 2024], 50.00th=[ 2128], 60.00th=[ 2320],
     | 70.00th=[ 3024], 80.00th=[ 4048], 90.00th=[ 5280], 95.00th=[ 7456],
     | 99.00th=[14784], 99.50th=[18560], 99.90th=[25984], 99.95th=[30080],
     | 99.99th=[77312]
   bw (  KiB/s): min=106080, max=144352, per=99.78%, avg=129671.58, stdev=13091.83, samples=19
   iops        : min=26520, max=36088, avg=32418.00, stdev=3273.07, samples=19
  write: IOPS=32.4k, BW=127MiB/s (133MB/s)(1268MiB/10001msec); 0 zone resets
    slat (nsec): min=29, max=34345, avg=71.60, stdev=146.15
    clat (usec): min=7, max=1720, avg=26.74, stdev= 5.40
     lat (usec): min=7, max=1720, avg=26.82, stdev= 5.41
    clat percentiles (nsec):
     |  1.00th=[20608],  5.00th=[21632], 10.00th=[22656], 20.00th=[23680],
     | 30.00th=[24448], 40.00th=[25472], 50.00th=[25984], 60.00th=[26752],
     | 70.00th=[27520], 80.00th=[29824], 90.00th=[32128], 95.00th=[33536],
     | 99.00th=[40192], 99.50th=[43776], 99.90th=[49920], 99.95th=[52992],
     | 99.99th=[93696]
   bw (  KiB/s): min=106392, max=144664, per=99.86%, avg=129610.95, stdev=13141.02, samples=19
   iops        : min=26598, max=36166, avg=32402.74, stdev=3285.25, samples=19
  lat (usec)   : 2=19.16%, 4=20.65%, 10=8.97%, 20=1.48%, 50=49.68%
  lat (usec)   : 100=0.06%, 250=0.01%, 500=0.01%, 750=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=7.98%, sys=39.88%, ctx=324310, majf=0, minf=16
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=324914,324519,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=127MiB/s (133MB/s), 127MiB/s-127MiB/s (133MB/s-133MB/s), io=1269MiB (1331MB), run=10001-10001msec
  WRITE: bw=127MiB/s (133MB/s), 127MiB/s-127MiB/s (133MB/s-133MB/s), io=1268MiB (1329MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/106, sectors=0/30520, merge=0/701, ticks=0/199, in_queue=199, util=0.07%
```

[&lt; back](..)

# perftest--without-liburing-file-4k-1-1

2026-11-15 12:04:35

refs/heads/main

[6a4e086](https://github.com/rawstor/librawstor/commit/6a4e0869ffcacd0f0eced8184e301af26a4adcd5)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15602: Sun Nov 15 12:04:03 2026
  read: IOPS=324k, BW=1266MiB/s (1327MB/s)(12.4GiB/10001msec)
    slat (nsec): min=300, max=40115, avg=400.38, stdev=211.49
    clat (nsec): min=1713, max=42971, avg=2433.49, stdev=573.18
     lat (nsec): min=2064, max=43361, avg=2833.87, stdev=623.78
    clat percentiles (nsec):
     |  1.00th=[ 1960],  5.00th=[ 2024], 10.00th=[ 2064], 20.00th=[ 2160],
     | 30.00th=[ 2384], 40.00th=[ 2416], 50.00th=[ 2448], 60.00th=[ 2480],
     | 70.00th=[ 2480], 80.00th=[ 2544], 90.00th=[ 2608], 95.00th=[ 2704],
     | 99.00th=[ 3248], 99.50th=[ 4016], 99.90th=[11584], 99.95th=[12096],
     | 99.99th=[19072]
   bw (  MiB/s): min= 1252, max= 1273, per=100.00%, avg=1266.61, stdev= 5.14, samples=20
   iops        : min=320569, max=325951, avg=324252.15, stdev=1314.87, samples=20
  lat (usec)   : 2=3.26%, 4=96.23%, 10=0.26%, 20=0.24%, 50=0.01%
  cpu          : usr=52.51%, sys=47.47%, ctx=58, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3240795,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15607: Sun Nov 15 12:04:03 2026
  write: IOPS=3000, BW=11.7MiB/s (12.3MB/s)(117MiB/10001msec); 0 zone resets
    slat (nsec): min=1242, max=24676, avg=2471.12, stdev=920.47
    clat (usec): min=190, max=21223, avg=329.36, stdev=242.26
     lat (usec): min=192, max=21226, avg=331.83, stdev=242.28
    clat percentiles (usec):
     |  1.00th=[  210],  5.00th=[  233], 10.00th=[  245], 20.00th=[  262],
     | 30.00th=[  281], 40.00th=[  293], 50.00th=[  306], 60.00th=[  322],
     | 70.00th=[  338], 80.00th=[  359], 90.00th=[  392], 95.00th=[  437],
     | 99.00th=[  660], 99.50th=[  881], 99.90th=[ 3720], 99.95th=[ 4359],
     | 99.99th=[ 5800]
   bw (  KiB/s): min=10816, max=12824, per=100.00%, avg=12008.00, stdev=556.41, samples=20
   iops        : min= 2704, max= 3206, avg=3001.90, stdev=139.13, samples=20
  lat (usec)   : 250=13.76%, 500=83.33%, 750=2.23%, 1000=0.24%
  lat (msec)   : 2=0.11%, 4=0.26%, 10=0.06%, 50=0.01%
  cpu          : usr=2.86%, sys=10.76%, ctx=60379, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,30011,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1266MiB/s (1327MB/s), 1266MiB/s-1266MiB/s (1327MB/s-1327MB/s), io=12.4GiB (13.3GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=11.7MiB/s (12.3MB/s), 11.7MiB/s-11.7MiB/s (12.3MB/s-12.3MB/s), io=117MiB (123MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=2/76327, sectors=224/2205096, merge=0/115572, ticks=6/12347, in_queue=12354, util=37.63%
```

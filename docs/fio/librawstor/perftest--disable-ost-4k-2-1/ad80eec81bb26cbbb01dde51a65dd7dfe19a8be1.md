[&lt; back](..)

# perftest--disable-ost-4k-2-1

2025-08-27 21:42:12 UTC

refs/heads/main

[ad80eec](https://github.com/rawstor/librawstor/commit/ad80eec81bb26cbbb01dde51a65dd7dfe19a8be1)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9765: Wed Aug 27 21:42:10 2025
  read: IOPS=71.9k, BW=281MiB/s (295MB/s)(2810MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5389.23, stdev=2819.91
     lat (nsec): min=1252, max=119652, avg=4863.94, stdev=3606.84
    clat percentiles (msec):
     |  1.00th=[  224],  5.00th=[  743], 10.00th=[ 1401], 20.00th=[ 2500],
     | 30.00th=[ 3540], 40.00th=[ 4530], 50.00th=[ 5470], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=217544, max=334512, per=99.63%, avg=286663.16, stdev=34589.54, samples=19
   iops        : min=54386, max=83628, avg=71665.79, stdev=8647.39, samples=19
  write: IOPS=71.8k, BW=281MiB/s (294MB/s)(2807MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5388.64, stdev=2819.97
     lat (usec): min=3, max=715, avg=22.05, stdev= 6.66
    clat percentiles (msec):
     |  1.00th=[  222],  5.00th=[  743], 10.00th=[ 1401], 20.00th=[ 2500],
     | 30.00th=[ 3507], 40.00th=[ 4530], 50.00th=[ 5470], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=215248, max=331048, per=99.62%, avg=286303.58, stdev=34434.98, samples=19
   iops        : min=53812, max=82762, avg=71575.89, stdev=8608.74, samples=19
  lat (msec)   : 250=1.21%, 500=1.88%, 750=1.95%, 1000=1.86%, 2000=7.97%
  lat (msec)   : >=2000=85.13%
  cpu          : usr=16.23%, sys=50.33%, ctx=300565, majf=0, minf=16
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=719408,718545,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=281MiB/s (295MB/s), 281MiB/s-281MiB/s (295MB/s-295MB/s), io=2810MiB (2947MB), run=10001-10001msec
  WRITE: bw=281MiB/s (294MB/s), 281MiB/s-281MiB/s (294MB/s-294MB/s), io=2807MiB (2943MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=1/262, sectors=248/33720, merge=0/1001, ticks=0/664, in_queue=664, util=0.11%
```

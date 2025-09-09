[&lt; back](..)

# perftest--disable-ost-4k-2-1

2025-09-09 20:06:18

refs/heads/feat/no_poll

[eec4b9a](https://github.com/rawstor/librawstor/commit/eec4b9adaf7366bbc92bbc289e7bb9aab41b7529)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10238: Tue Sep  9 20:06:16 2025
  read: IOPS=64.8k, BW=253MiB/s (265MB/s)(2531MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5444.65, stdev=2821.66
     lat (nsec): min=1252, max=704352, avg=5568.23, stdev=4294.20
    clat percentiles (msec):
     |  1.00th=[  232],  5.00th=[  760], 10.00th=[ 1401], 20.00th=[ 2635],
     | 30.00th=[ 3641], 40.00th=[ 4597], 50.00th=[ 5537], 60.00th=[ 6477],
     | 70.00th=[ 7483], 80.00th=[ 8356], 90.00th=[ 9194], 95.00th=[ 9731],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=194896, max=304808, per=100.00%, avg=259193.70, stdev=35067.72, samples=20
   iops        : min=48724, max=76202, avg=64798.40, stdev=8766.98, samples=20
  write: IOPS=64.8k, BW=253MiB/s (265MB/s)(2530MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=105, max=10104, avg=5446.11, stdev=2822.68
     lat (usec): min=3, max=711, avg=24.24, stdev= 7.77
    clat percentiles (msec):
     |  1.00th=[  230],  5.00th=[  760], 10.00th=[ 1418], 20.00th=[ 2635],
     | 30.00th=[ 3641], 40.00th=[ 4597], 50.00th=[ 5537], 60.00th=[ 6477],
     | 70.00th=[ 7483], 80.00th=[ 8356], 90.00th=[ 9194], 95.00th=[ 9731],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=193112, max=306816, per=100.00%, avg=259007.70, stdev=35095.07, samples=20
   iops        : min=48278, max=76704, avg=64751.90, stdev=8773.81, samples=20
  lat (msec)   : 250=1.15%, 500=1.90%, 750=1.88%, 1000=1.89%, 2000=7.74%
  lat (msec)   : >=2000=85.44%
  cpu          : usr=16.08%, sys=50.23%, ctx=270585, majf=0, minf=23
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=648034,647569,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=253MiB/s (265MB/s), 253MiB/s-253MiB/s (265MB/s-265MB/s), io=2531MiB (2654MB), run=10001-10001msec
  WRITE: bw=253MiB/s (265MB/s), 253MiB/s-253MiB/s (265MB/s-265MB/s), io=2530MiB (2652MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/129, sectors=0/3920, merge=0/158, ticks=0/236, in_queue=236, util=0.04%
```

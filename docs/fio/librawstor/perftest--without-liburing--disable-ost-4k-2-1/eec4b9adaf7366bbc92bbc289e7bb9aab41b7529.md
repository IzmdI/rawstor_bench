[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-2-1

2025-09-09 20:04:39

refs/heads/feat/no_poll

[eec4b9a](https://github.com/rawstor/librawstor/commit/eec4b9adaf7366bbc92bbc289e7bb9aab41b7529)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10375: Tue Sep  9 20:04:37 2025
  read: IOPS=33.8k, BW=132MiB/s (138MB/s)(1320MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=111, max=10104, avg=5361.46, stdev=2846.24
     lat (usec): min=3, max=6715, avg=28.04, stdev=22.30
    clat percentiles (msec):
     |  1.00th=[  232],  5.00th=[  693], 10.00th=[ 1284], 20.00th=[ 2433],
     | 30.00th=[ 3507], 40.00th=[ 4530], 50.00th=[ 5470], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=114424, max=149704, per=99.53%, avg=134497.68, stdev=13196.37, samples=19
   iops        : min=28606, max=37426, avg=33624.42, stdev=3299.09, samples=19
  write: IOPS=33.7k, BW=132MiB/s (138MB/s)(1318MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=117, max=10104, avg=5357.02, stdev=2841.17
     lat (usec): min=4, max=6456, avg=29.98, stdev=17.93
    clat percentiles (msec):
     |  1.00th=[  228],  5.00th=[  693], 10.00th=[ 1284], 20.00th=[ 2433],
     | 30.00th=[ 3507], 40.00th=[ 4530], 50.00th=[ 5470], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=114456, max=147824, per=99.61%, avg=134415.16, stdev=13263.33, samples=19
   iops        : min=28614, max=36956, avg=33603.79, stdev=3315.83, samples=19
  lat (msec)   : 250=1.19%, 500=2.25%, 750=2.07%, 1000=2.09%, 2000=8.65%
  lat (msec)   : >=2000=83.76%
  cpu          : usr=15.40%, sys=37.41%, ctx=346993, majf=0, minf=585
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=337865,337375,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=132MiB/s (138MB/s), 132MiB/s-132MiB/s (138MB/s-138MB/s), io=1320MiB (1384MB), run=10001-10001msec
  WRITE: bw=132MiB/s (138MB/s), 132MiB/s-132MiB/s (138MB/s-138MB/s), io=1318MiB (1382MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/47, sectors=0/73400, merge=0/148, ticks=0/230, in_queue=230, util=0.08%
```

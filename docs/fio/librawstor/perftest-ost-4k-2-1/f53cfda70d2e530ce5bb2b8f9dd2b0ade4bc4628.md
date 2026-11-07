[&lt; back](..)

# perftest-ost-4k-2-1

2026-11-07 13:11:26

refs/heads/main

[f53cfda](https://github.com/rawstor/librawstor/commit/f53cfda70d2e530ce5bb2b8f9dd2b0ade4bc4628)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15629: Sat Nov  7 13:11:05 2026
  read: IOPS=37.5k, BW=146MiB/s (153MB/s)(1463MiB/10001msec)
    slat (nsec): min=360, max=40790, avg=861.39, stdev=540.65
    clat (usec): min=20, max=1411, avg=51.91, stdev=12.94
     lat (usec): min=20, max=1413, avg=52.77, stdev=12.94
    clat percentiles (usec):
     |  1.00th=[   23],  5.00th=[   32], 10.00th=[   36], 20.00th=[   45],
     | 30.00th=[   47], 40.00th=[   50], 50.00th=[   53], 60.00th=[   55],
     | 70.00th=[   57], 80.00th=[   61], 90.00th=[   67], 95.00th=[   72],
     | 99.00th=[   86], 99.50th=[   92], 99.90th=[  104], 99.95th=[  112],
     | 99.99th=[  133]
   bw (  KiB/s): min=139288, max=164808, per=100.00%, avg=149941.10, stdev=6829.15, samples=20
   iops        : min=34822, max=41202, avg=37485.25, stdev=1707.29, samples=20
  lat (usec)   : 50=41.64%, 100=58.20%, 250=0.16%, 750=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=14.10%, sys=52.96%, ctx=173881, majf=0, minf=1903
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=374644,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15633: Sat Nov  7 13:11:05 2026
  write: IOPS=4079, BW=15.9MiB/s (16.7MB/s)(159MiB/10001msec); 0 zone resets
    slat (nsec): min=712, max=39835, avg=3287.51, stdev=1640.90
    clat (usec): min=301, max=11616, avg=485.26, stdev=272.78
     lat (usec): min=303, max=11619, avg=488.55, stdev=272.73
    clat percentiles (usec):
     |  1.00th=[  338],  5.00th=[  359], 10.00th=[  375], 20.00th=[  392],
     | 30.00th=[  408], 40.00th=[  420], 50.00th=[  437], 60.00th=[  457],
     | 70.00th=[  486], 80.00th=[  537], 90.00th=[  619], 95.00th=[  693],
     | 99.00th=[  988], 99.50th=[ 1631], 99.90th=[ 4015], 99.95th=[ 4555],
     | 99.99th=[10290]
   bw (  KiB/s): min=15815, max=16944, per=100.00%, avg=16325.50, stdev=290.40, samples=20
   iops        : min= 3953, max= 4236, avg=4081.30, stdev=72.72, samples=20
  lat (usec)   : 500=73.95%, 750=22.89%, 1000=2.18%
  lat (msec)   : 2=0.51%, 4=0.36%, 10=0.09%, 20=0.02%
  cpu          : usr=4.58%, sys=12.43%, ctx=38489, majf=0, minf=37
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,40798,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=146MiB/s (153MB/s), 146MiB/s-146MiB/s (153MB/s-153MB/s), io=1463MiB (1535MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=15.9MiB/s (16.7MB/s), 15.9MiB/s-15.9MiB/s (16.7MB/s-16.7MB/s), io=159MiB (167MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=3/101722, sectors=24/2249928, merge=0/160793, ticks=2/13199, in_queue=13202, util=30.76%
```

[&lt; back](..)

# perftest-4k-1-1

2025-09-03 09:32:57 UTC

refs/heads/feat/opts

[73e2d50](https://github.com/rawstor/librawstor/commit/73e2d50dc6eeb3fe1c68ccb039fb619d9c8cf8ec)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10768: Wed Sep  3 09:32:55 2025
  read: IOPS=6215, BW=24.3MiB/s (25.5MB/s)(243MiB/10001msec)
    slat (nsec): min=40, max=23895, avg=180.68, stdev=209.21
    clat (usec): min=38, max=22968, avg=67.42, stdev=195.33
     lat (usec): min=38, max=22968, avg=67.60, stdev=195.33
    clat percentiles (usec):
     |  1.00th=[   50],  5.00th=[   53], 10.00th=[   55], 20.00th=[   58],
     | 30.00th=[   60], 40.00th=[   62], 50.00th=[   64], 60.00th=[   67],
     | 70.00th=[   70], 80.00th=[   73], 90.00th=[   78], 95.00th=[   84],
     | 99.00th=[   99], 99.50th=[  108], 99.90th=[  130], 99.95th=[  149],
     | 99.99th=[ 1647]
   bw (  KiB/s): min=23224, max=27560, per=100.00%, avg=24863.20, stdev=1141.84, samples=20
   iops        : min= 5806, max= 6890, avg=6215.80, stdev=285.46, samples=20
  write: IOPS=6191, BW=24.2MiB/s (25.4MB/s)(242MiB/10001msec); 0 zone resets
    slat (nsec): min=80, max=18374, avg=264.16, stdev=264.59
    clat (usec): min=56, max=25138, avg=90.30, stdev=136.51
     lat (usec): min=56, max=25138, avg=90.57, stdev=136.51
    clat percentiles (usec):
     |  1.00th=[   73],  5.00th=[   76], 10.00th=[   79], 20.00th=[   82],
     | 30.00th=[   84], 40.00th=[   86], 50.00th=[   89], 60.00th=[   91],
     | 70.00th=[   93], 80.00th=[   96], 90.00th=[  102], 95.00th=[  109],
     | 99.00th=[  123], 99.50th=[  133], 99.90th=[  159], 99.95th=[  186],
     | 99.99th=[ 1090]
   bw (  KiB/s): min=22848, max=27512, per=100.00%, avg=24769.60, stdev=1242.11, samples=20
   iops        : min= 5712, max= 6878, avg=6192.40, stdev=310.53, samples=20
  lat (usec)   : 50=0.49%, 100=92.69%, 250=6.80%, 500=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 20=0.01%, 50=0.01%
  cpu          : usr=5.86%, sys=35.02%, ctx=124162, majf=0, minf=279
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=62158,61924,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=24.3MiB/s (25.5MB/s), 24.3MiB/s-24.3MiB/s (25.5MB/s-25.5MB/s), io=243MiB (255MB), run=10001-10001msec
  WRITE: bw=24.2MiB/s (25.4MB/s), 24.2MiB/s-24.2MiB/s (25.4MB/s-25.4MB/s), io=242MiB (254MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/49, sectors=0/11728, merge=0/26, ticks=0/35, in_queue=35, util=0.01%
```

[&lt; back](..)

# perftest--without-liburing-4k-1-1

2025-09-09 20:04:52

refs/heads/feat/no_poll

[eec4b9a](https://github.com/rawstor/librawstor/commit/eec4b9adaf7366bbc92bbc289e7bb9aab41b7529)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=11420: Tue Sep  9 20:04:51 2025
  read: IOPS=4038, BW=15.8MiB/s (16.5MB/s)(158MiB/10001msec)
    slat (nsec): min=30, max=18084, avg=207.34, stdev=248.93
    clat (usec): min=73, max=24021, avg=122.07, stdev=121.37
     lat (usec): min=73, max=24021, avg=122.27, stdev=121.38
    clat percentiles (usec):
     |  1.00th=[   89],  5.00th=[  100], 10.00th=[  105], 20.00th=[  111],
     | 30.00th=[  114], 40.00th=[  118], 50.00th=[  121], 60.00th=[  124],
     | 70.00th=[  128], 80.00th=[  133], 90.00th=[  139], 95.00th=[  147],
     | 99.00th=[  161], 99.50th=[  169], 99.90th=[  206], 99.95th=[  285],
     | 99.99th=[  881]
   bw (  KiB/s): min=14856, max=18576, per=100.00%, avg=16154.80, stdev=1017.49, samples=20
   iops        : min= 3714, max= 4644, avg=4038.70, stdev=254.37, samples=20
  write: IOPS=4029, BW=15.7MiB/s (16.5MB/s)(157MiB/10001msec); 0 zone resets
    slat (nsec): min=60, max=18104, avg=298.71, stdev=268.05
    clat (usec): min=74, max=23221, avg=121.75, stdev=220.94
     lat (usec): min=75, max=23222, avg=122.04, stdev=220.94
    clat percentiles (usec):
     |  1.00th=[   97],  5.00th=[  102], 10.00th=[  105], 20.00th=[  110],
     | 30.00th=[  113], 40.00th=[  116], 50.00th=[  119], 60.00th=[  122],
     | 70.00th=[  125], 80.00th=[  129], 90.00th=[  135], 95.00th=[  141],
     | 99.00th=[  157], 99.50th=[  169], 99.90th=[  217], 99.95th=[  314],
     | 99.99th=[ 1057]
   bw (  KiB/s): min=14672, max=17976, per=100.00%, avg=16120.80, stdev=870.19, samples=20
   iops        : min= 3668, max= 4494, avg=4030.20, stdev=217.55, samples=20
  lat (usec)   : 100=3.96%, 250=95.97%, 500=0.05%, 750=0.01%, 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 50=0.01%
  cpu          : usr=8.27%, sys=17.12%, ctx=204319, majf=0, minf=288
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=40387,40302,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=15.8MiB/s (16.5MB/s), 15.8MiB/s-15.8MiB/s (16.5MB/s-16.5MB/s), io=158MiB (165MB), run=10001-10001msec
  WRITE: bw=15.7MiB/s (16.5MB/s), 15.7MiB/s-15.7MiB/s (16.5MB/s-16.5MB/s), io=157MiB (165MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=4/287, sectors=752/43976, merge=0/1492, ticks=0/385, in_queue=392, util=0.22%
```

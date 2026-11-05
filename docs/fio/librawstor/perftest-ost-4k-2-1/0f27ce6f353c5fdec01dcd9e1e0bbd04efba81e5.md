[&lt; back](..)

# perftest-ost-4k-2-1

2026-11-05 13:03:18

refs/heads/main

[0f27ce6](https://github.com/rawstor/librawstor/commit/0f27ce6f353c5fdec01dcd9e1e0bbd04efba81e5)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15292: Thu Nov  5 13:02:39 2026
  read: IOPS=52.8k, BW=206MiB/s (216MB/s)(2063MiB/10001msec)
    slat (nsec): min=437, max=45607, avg=879.82, stdev=452.52
    clat (usec): min=13, max=652, avg=36.70, stdev= 9.72
     lat (usec): min=13, max=655, avg=37.58, stdev= 9.67
    clat percentiles (usec):
     |  1.00th=[   15],  5.00th=[   17], 10.00th=[   25], 20.00th=[   30],
     | 30.00th=[   36], 40.00th=[   37], 50.00th=[   39], 60.00th=[   40],
     | 70.00th=[   41], 80.00th=[   43], 90.00th=[   46], 95.00th=[   50],
     | 99.00th=[   63], 99.50th=[   68], 99.90th=[   86], 99.95th=[   99],
     | 99.99th=[  153]
   bw (  KiB/s): min=191462, max=236976, per=100.00%, avg=211364.60, stdev=12117.99, samples=20
   iops        : min=47865, max=59244, avg=52841.05, stdev=3029.53, samples=20
  lat (usec)   : 20=6.52%, 50=88.67%, 100=4.77%, 250=0.04%, 500=0.01%
  lat (usec)   : 750=0.01%
  cpu          : usr=18.05%, sys=40.18%, ctx=248055, majf=0, minf=254
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=528169,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15295: Thu Nov  5 13:02:39 2026
  write: IOPS=3442, BW=13.4MiB/s (14.1MB/s)(134MiB/10001msec); 0 zone resets
    slat (nsec): min=902, max=32709, avg=2414.07, stdev=1531.80
    clat (usec): min=324, max=9180, avg=577.83, stdev=216.46
     lat (usec): min=326, max=9183, avg=580.24, stdev=216.41
    clat percentiles (usec):
     |  1.00th=[  375],  5.00th=[  408], 10.00th=[  429], 20.00th=[  457],
     | 30.00th=[  482], 40.00th=[  506], 50.00th=[  537], 60.00th=[  570],
     | 70.00th=[  603], 80.00th=[  668], 90.00th=[  791], 95.00th=[  881],
     | 99.00th=[ 1057], 99.50th=[ 1172], 99.90th=[ 1942], 99.95th=[ 4686],
     | 99.99th=[ 7898]
   bw (  KiB/s): min=11896, max=14480, per=100.00%, avg=13774.60, stdev=520.09, samples=20
   iops        : min= 2974, max= 3620, avg=3443.55, stdev=130.05, samples=20
  lat (usec)   : 500=37.23%, 750=49.77%, 1000=11.34%
  lat (msec)   : 2=1.57%, 4=0.03%, 10=0.06%
  cpu          : usr=3.01%, sys=4.50%, ctx=31315, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,34424,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=206MiB/s (216MB/s), 206MiB/s-206MiB/s (216MB/s-216MB/s), io=2063MiB (2163MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=13.4MiB/s (14.1MB/s), 13.4MiB/s-13.4MiB/s (14.1MB/s-14.1MB/s), io=134MiB (141MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=1/83762, sectors=8/1888368, merge=0/132173, ticks=4/19019, in_queue=19023, util=36.66%
```

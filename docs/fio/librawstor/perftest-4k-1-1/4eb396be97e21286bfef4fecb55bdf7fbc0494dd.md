[&lt; back](..)

# perftest-4k-1-1

2025-09-01 19:26:04

refs/heads/feat/no_poll

[4eb396b](https://github.com/rawstor/librawstor/commit/4eb396be97e21286bfef4fecb55bdf7fbc0494dd)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10756: Mon Sep  1 19:26:03 2025
  read: IOPS=6026, BW=23.5MiB/s (24.7MB/s)(235MiB/10001msec)
    slat (nsec): min=40, max=16210, avg=161.32, stdev=135.90
    clat (usec): min=40, max=33255, avg=69.11, stdev=231.85
     lat (usec): min=40, max=33255, avg=69.27, stdev=231.85
    clat percentiles (usec):
     |  1.00th=[   51],  5.00th=[   55], 10.00th=[   56], 20.00th=[   60],
     | 30.00th=[   62], 40.00th=[   64], 50.00th=[   66], 60.00th=[   69],
     | 70.00th=[   72], 80.00th=[   75], 90.00th=[   80], 95.00th=[   86],
     | 99.00th=[   99], 99.50th=[  108], 99.90th=[  128], 99.95th=[  163],
     | 99.99th=[  807]
   bw (  KiB/s): min=21912, max=27232, per=100.00%, avg=24109.20, stdev=1428.97, samples=20
   iops        : min= 5478, max= 6808, avg=6027.30, stdev=357.24, samples=20
  write: IOPS=6015, BW=23.5MiB/s (24.6MB/s)(235MiB/10001msec); 0 zone resets
    slat (nsec): min=80, max=18525, avg=243.50, stdev=234.47
    clat (usec): min=56, max=29596, avg=93.51, stdev=227.47
     lat (usec): min=56, max=29596, avg=93.75, stdev=227.47
    clat percentiles (usec):
     |  1.00th=[   72],  5.00th=[   77], 10.00th=[   80], 20.00th=[   83],
     | 30.00th=[   86], 40.00th=[   88], 50.00th=[   91], 60.00th=[   93],
     | 70.00th=[   96], 80.00th=[   99], 90.00th=[  105], 95.00th=[  112],
     | 99.00th=[  126], 99.50th=[  135], 99.90th=[  161], 99.95th=[  182],
     | 99.99th=[ 2507]
   bw (  KiB/s): min=22400, max=26416, per=100.00%, avg=24062.80, stdev=1147.49, samples=20
   iops        : min= 5600, max= 6604, avg=6015.70, stdev=286.87, samples=20
  lat (usec)   : 50=0.30%, 100=90.50%, 250=9.18%, 500=0.01%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 50=0.01%
  cpu          : usr=5.64%, sys=35.09%, ctx=120531, majf=0, minf=279
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=60273,60157,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=23.5MiB/s (24.7MB/s), 23.5MiB/s-23.5MiB/s (24.7MB/s-24.7MB/s), io=235MiB (247MB), run=10001-10001msec
  WRITE: bw=23.5MiB/s (24.6MB/s), 23.5MiB/s-23.5MiB/s (24.6MB/s-24.6MB/s), io=235MiB (246MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/51, sectors=0/11976, merge=0/31, ticks=0/31, in_queue=30, util=0.01%
```

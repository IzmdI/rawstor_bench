[&lt; back](..)

# perftest--disable-ost-4k-2-1

2025-08-10 17:09:25

refs/heads/feat/rawstorstd

[b4d5bdb](https://github.com/rawstor/librawstor/commit/b4d5bdb04f86dafd58ab1d3be6d8de177b150eda)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9508: Sun Aug 10 17:09:25 2025
  read: IOPS=69.9k, BW=273MiB/s (286MB/s)(2732MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=111, max=10111, avg=5441.32, stdev=2805.97
     lat (nsec): min=1273, max=150683, avg=5119.24, stdev=3878.24
    clat percentiles (msec):
     |  1.00th=[  247],  5.00th=[  785], 10.00th=[ 1418], 20.00th=[ 2668],
     | 30.00th=[ 3641], 40.00th=[ 4597], 50.00th=[ 5537], 60.00th=[ 6477],
     | 70.00th=[ 7416], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9731],
     | 99.00th=[10000], 99.50th=[10134], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=206840, max=328256, per=100.00%, avg=279746.80, stdev=38287.95, samples=20
   iops        : min=51710, max=82064, avg=69936.70, stdev=9571.99, samples=20
  write: IOPS=69.8k, BW=273MiB/s (286MB/s)(2727MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=111, max=10111, avg=5438.56, stdev=2804.75
     lat (usec): min=3, max=733, avg=22.57, stdev= 6.83
    clat percentiles (msec):
     |  1.00th=[  247],  5.00th=[  785], 10.00th=[ 1418], 20.00th=[ 2668],
     | 30.00th=[ 3641], 40.00th=[ 4597], 50.00th=[ 5537], 60.00th=[ 6477],
     | 70.00th=[ 7416], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9731],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=206096, max=327904, per=100.00%, avg=279286.80, stdev=37991.87, samples=20
   iops        : min=51524, max=81976, avg=69821.70, stdev=9497.97, samples=20
  lat (msec)   : 250=1.02%, 500=1.86%, 750=1.83%, 1000=2.06%, 2000=7.61%
  lat (msec)   : >=2000=85.60%
  cpu          : usr=15.64%, sys=48.81%, ctx=297790, majf=0, minf=13
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=699367,698217,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=273MiB/s (286MB/s), 273MiB/s-273MiB/s (286MB/s-286MB/s), io=2732MiB (2865MB), run=10001-10001msec
  WRITE: bw=273MiB/s (286MB/s), 273MiB/s-273MiB/s (286MB/s-286MB/s), io=2727MiB (2860MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/223, sectors=0/219856, merge=0/698, ticks=0/504, in_queue=503, util=0.23%
```

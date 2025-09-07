[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-2-1

2025-08-10 17:09:28

refs/heads/feat/rawstorstd

[b4d5bdb](https://github.com/rawstor/librawstor/commit/b4d5bdb04f86dafd58ab1d3be6d8de177b150eda)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9482: Sun Aug 10 17:09:27 2025
  read: IOPS=197k, BW=771MiB/s (809MB/s)(7715MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=110, max=10110, avg=5496.82, stdev=2726.60
     lat (nsec): min=1422, max=117859, avg=1984.25, stdev=1111.24
    clat percentiles (msec):
     |  1.00th=[  288],  5.00th=[ 1045], 10.00th=[ 1703], 20.00th=[ 2769],
     | 30.00th=[ 3742], 40.00th=[ 4665], 50.00th=[ 5537], 60.00th=[ 6477],
     | 70.00th=[ 7416], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=410976, max=876352, per=100.00%, avg=790053.20, stdev=142727.44, samples=20
   iops        : min=102744, max=219088, avg=197513.30, stdev=35681.87, samples=20
  write: IOPS=197k, BW=771MiB/s (808MB/s)(7707MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=110, max=10110, avg=5497.03, stdev=2726.54
     lat (usec): min=4, max=173, avg= 7.65, stdev= 4.05
    clat percentiles (msec):
     |  1.00th=[  284],  5.00th=[ 1045], 10.00th=[ 1703], 20.00th=[ 2769],
     | 30.00th=[ 3742], 40.00th=[ 4665], 50.00th=[ 5537], 60.00th=[ 6477],
     | 70.00th=[ 7416], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=411784, max=876504, per=100.00%, avg=789246.00, stdev=142546.07, samples=20
   iops        : min=102946, max=219126, avg=197311.50, stdev=35636.52, samples=20
  lat (msec)   : 250=0.80%, 500=1.38%, 750=1.29%, 1000=1.27%, 2000=7.90%
  lat (msec)   : >=2000=87.36%
  cpu          : usr=28.06%, sys=71.92%, ctx=59, majf=0, minf=25
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=1975133,1973115,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=771MiB/s (809MB/s), 771MiB/s-771MiB/s (809MB/s-809MB/s), io=7715MiB (8090MB), run=10001-10001msec
  WRITE: bw=771MiB/s (808MB/s), 771MiB/s-771MiB/s (808MB/s-808MB/s), io=7707MiB (8082MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/208, sectors=0/220928, merge=0/960, ticks=0/1754, in_queue=1761, util=0.29%
```

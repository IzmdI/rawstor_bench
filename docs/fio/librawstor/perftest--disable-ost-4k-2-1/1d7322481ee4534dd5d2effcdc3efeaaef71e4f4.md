[&lt; back](..)

# perftest--disable-ost-4k-2-1

2025-09-07 13:57:53

refs/heads/feat/cpp

[1d73224](https://github.com/rawstor/librawstor/commit/1d7322481ee4534dd5d2effcdc3efeaaef71e4f4)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10224: Sun Sep  7 13:57:50 2025
  read: IOPS=71.0k, BW=277MiB/s (291MB/s)(2774MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=110, max=10110, avg=5358.71, stdev=2811.18
     lat (nsec): min=1252, max=129652, avg=4993.88, stdev=3709.72
    clat percentiles (msec):
     |  1.00th=[  245],  5.00th=[  743], 10.00th=[ 1418], 20.00th=[ 2534],
     | 30.00th=[ 3507], 40.00th=[ 4396], 50.00th=[ 5403], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=205232, max=322648, per=99.71%, avg=283209.26, stdev=33698.75, samples=19
   iops        : min=51308, max=80662, avg=70802.32, stdev=8424.69, samples=19
  write: IOPS=70.9k, BW=277MiB/s (290MB/s)(2770MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=110, max=10110, avg=5356.89, stdev=2810.49
     lat (usec): min=3, max=805, avg=22.22, stdev= 6.84
    clat percentiles (msec):
     |  1.00th=[  243],  5.00th=[  743], 10.00th=[ 1418], 20.00th=[ 2534],
     | 30.00th=[ 3507], 40.00th=[ 4396], 50.00th=[ 5403], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=204968, max=322440, per=99.74%, avg=282875.79, stdev=34029.98, samples=19
   iops        : min=51242, max=80610, avg=70718.95, stdev=8507.50, samples=19
  lat (msec)   : 250=1.05%, 500=1.96%, 750=2.07%, 1000=1.84%, 2000=7.80%
  lat (msec)   : >=2000=85.29%
  cpu          : usr=16.44%, sys=50.83%, ctx=293223, majf=0, minf=15
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=710127,709089,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=277MiB/s (291MB/s), 277MiB/s-277MiB/s (291MB/s-291MB/s), io=2774MiB (2909MB), run=10001-10001msec
  WRITE: bw=277MiB/s (290MB/s), 277MiB/s-277MiB/s (290MB/s-290MB/s), io=2770MiB (2904MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/310, sectors=0/38584, merge=0/1552, ticks=0/662, in_queue=671, util=0.24%
```

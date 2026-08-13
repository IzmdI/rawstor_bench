[&lt; back](..)

# perftest--without-liburing-ost-legacy-4k-2-1

2026-08-03 15:53:01

refs/tags/v0.2.2

[fd1963e](https://github.com/rawstor/librawstor/commit/fd1963ee0fa5ddb71310d89cacdd5b137aed4a6e)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=13126: Mon Aug  3 15:51:55 2026
  read: IOPS=10.4k, BW=40.5MiB/s (42.5MB/s)(405MiB/10001msec)
    slat (nsec): min=190, max=29134, avg=701.12, stdev=684.44
    clat (usec): min=141, max=16948, avg=191.09, stdev=142.81
     lat (usec): min=141, max=16949, avg=191.79, stdev=142.81
    clat percentiles (usec):
     |  1.00th=[  159],  5.00th=[  165], 10.00th=[  167], 20.00th=[  172],
     | 30.00th=[  176], 40.00th=[  180], 50.00th=[  184], 60.00th=[  188],
     | 70.00th=[  192], 80.00th=[  200], 90.00th=[  229], 95.00th=[  249],
     | 99.00th=[  277], 99.50th=[  285], 99.90th=[  306], 99.95th=[  338],
     | 99.99th=[11076]
   bw (  KiB/s): min=40240, max=42400, per=100.00%, avg=41536.40, stdev=668.05, samples=20
   iops        : min=10060, max=10600, avg=10384.00, stdev=167.05, samples=20
  lat (usec)   : 250=95.13%, 500=4.84%, 750=0.01%, 1000=0.01%
  lat (msec)   : 2=0.01%, 20=0.01%
  cpu          : usr=12.28%, sys=64.89%, ctx=52365, majf=0, minf=1824133
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=103789,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=13141: Mon Aug  3 15:51:55 2026
  write: IOPS=9016, BW=35.2MiB/s (36.9MB/s)(352MiB/10001msec); 0 zone resets
    slat (nsec): min=531, max=30206, avg=1470.57, stdev=1032.87
    clat (usec): min=159, max=21501, avg=219.26, stdev=194.29
     lat (usec): min=160, max=21502, avg=220.73, stdev=194.30
    clat percentiles (usec):
     |  1.00th=[  178],  5.00th=[  184], 10.00th=[  186], 20.00th=[  192],
     | 30.00th=[  196], 40.00th=[  200], 50.00th=[  204], 60.00th=[  210],
     | 70.00th=[  219], 80.00th=[  229], 90.00th=[  265], 95.00th=[  285],
     | 99.00th=[  338], 99.50th=[  433], 99.90th=[ 1139], 99.95th=[ 1467],
     | 99.99th=[14222]
   bw (  KiB/s): min=32712, max=39616, per=100.00%, avg=36087.55, stdev=2001.29, samples=20
   iops        : min= 8178, max= 9904, avg=9021.75, stdev=500.30, samples=20
  lat (usec)   : 250=85.89%, 500=13.72%, 750=0.18%, 1000=0.09%
  lat (msec)   : 2=0.09%, 4=0.02%, 10=0.01%, 20=0.01%, 50=0.01%
  cpu          : usr=10.69%, sys=58.71%, ctx=45457, majf=0, minf=1619589
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,90179,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=40.5MiB/s (42.5MB/s), 40.5MiB/s-40.5MiB/s (42.5MB/s-42.5MB/s), io=405MiB (425MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=35.2MiB/s (36.9MB/s), 35.2MiB/s-35.2MiB/s (36.9MB/s-36.9MB/s), io=352MiB (369MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=1/51244, sectors=152/636928, merge=0/1166, ticks=0/365445, in_queue=365449, util=8.69%
```

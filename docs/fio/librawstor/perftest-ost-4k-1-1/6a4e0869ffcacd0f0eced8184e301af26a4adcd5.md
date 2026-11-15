[&lt; back](..)

# perftest-ost-4k-1-1

2026-11-15 12:04:35

refs/heads/main

[6a4e086](https://github.com/rawstor/librawstor/commit/6a4e0869ffcacd0f0eced8184e301af26a4adcd5)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15664: Sun Nov 15 12:04:11 2026
  read: IOPS=17.3k, BW=67.7MiB/s (71.0MB/s)(677MiB/10001msec)
    slat (nsec): min=691, max=24305, avg=1137.17, stdev=645.68
    clat (usec): min=43, max=640, avg=55.64, stdev= 9.69
     lat (usec): min=44, max=642, avg=56.77, stdev= 9.93
    clat percentiles (usec):
     |  1.00th=[   45],  5.00th=[   46], 10.00th=[   46], 20.00th=[   47],
     | 30.00th=[   49], 40.00th=[   50], 50.00th=[   53], 60.00th=[   59],
     | 70.00th=[   62], 80.00th=[   64], 90.00th=[   68], 95.00th=[   74],
     | 99.00th=[   87], 99.50th=[   90], 99.90th=[   99], 99.95th=[  103],
     | 99.99th=[  114]
   bw (  KiB/s): min=61112, max=79552, per=100.00%, avg=69370.20, stdev=5540.09, samples=20
   iops        : min=15278, max=19888, avg=17342.50, stdev=1385.02, samples=20
  lat (usec)   : 50=41.04%, 100=58.87%, 250=0.09%, 750=0.01%
  cpu          : usr=10.85%, sys=37.11%, ctx=173366, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=173356,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15667: Sun Nov 15 12:04:11 2026
  write: IOPS=2281, BW=9126KiB/s (9345kB/s)(89.1MiB/10001msec); 0 zone resets
    slat (nsec): min=1924, max=25708, avg=3111.62, stdev=1052.77
    clat (usec): min=297, max=10268, avg=433.55, stdev=238.96
     lat (usec): min=300, max=10270, avg=436.67, stdev=238.99
    clat percentiles (usec):
     |  1.00th=[  318],  5.00th=[  330], 10.00th=[  343], 20.00th=[  363],
     | 30.00th=[  379], 40.00th=[  392], 50.00th=[  404], 60.00th=[  416],
     | 70.00th=[  433], 80.00th=[  457], 90.00th=[  498], 95.00th=[  562],
     | 99.00th=[  988], 99.50th=[ 1680], 99.90th=[ 3654], 99.95th=[ 4621],
     | 99.99th=[ 9896]
   bw (  KiB/s): min= 8104, max= 9672, per=100.00%, avg=9129.45, stdev=382.44, samples=20
   iops        : min= 2026, max= 2418, avg=2282.30, stdev=95.60, samples=20
  lat (usec)   : 500=90.32%, 750=7.81%, 1000=0.89%
  lat (msec)   : 2=0.55%, 4=0.36%, 10=0.05%, 20=0.01%
  cpu          : usr=2.54%, sys=6.06%, ctx=22817, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,22817,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=67.7MiB/s (71.0MB/s), 67.7MiB/s-67.7MiB/s (71.0MB/s-71.0MB/s), io=677MiB (710MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=9126KiB/s (9345kB/s), 9126KiB/s-9126KiB/s (9345kB/s-9345kB/s), io=89.1MiB (93.5MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=2/57597, sectors=224/1326824, merge=0/87193, ticks=4/8424, in_queue=8429, util=31.03%
```

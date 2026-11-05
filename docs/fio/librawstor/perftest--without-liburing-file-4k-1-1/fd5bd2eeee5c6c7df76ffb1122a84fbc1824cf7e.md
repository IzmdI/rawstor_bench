[&lt; back](..)

# perftest--without-liburing-file-4k-1-1

2026-11-05 20:32:29

refs/heads/add/cli-output-format

[fd5bd2e](https://github.com/rawstor/librawstor/commit/fd5bd2eeee5c6c7df76ffb1122a84fbc1824cf7e)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15465: Thu Nov  5 20:30:46 2026
  read: IOPS=305k, BW=1191MiB/s (1249MB/s)(11.6GiB/10001msec)
    slat (nsec): min=651, max=40098, avg=810.61, stdev=343.41
    clat (nsec): min=1456, max=99627, avg=2234.58, stdev=616.71
     lat (nsec): min=2155, max=100518, avg=3045.19, stdev=739.58
    clat percentiles (nsec):
     |  1.00th=[ 1704],  5.00th=[ 1784], 10.00th=[ 1832], 20.00th=[ 2008],
     | 30.00th=[ 2128], 40.00th=[ 2160], 50.00th=[ 2192], 60.00th=[ 2256],
     | 70.00th=[ 2288], 80.00th=[ 2352], 90.00th=[ 2512], 95.00th=[ 2608],
     | 99.00th=[ 3536], 99.50th=[ 4192], 99.90th=[ 9920], 99.95th=[12224],
     | 99.99th=[25216]
   bw (  MiB/s): min= 1089, max= 1212, per=100.00%, avg=1192.28, stdev=29.02, samples=20
   iops        : min=278842, max=310374, avg=305223.75, stdev=7428.42, samples=20
  lat (usec)   : 2=19.49%, 4=79.92%, 10=0.49%, 20=0.08%, 50=0.02%
  lat (usec)   : 100=0.01%
  cpu          : usr=62.98%, sys=37.00%, ctx=61, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3050497,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15469: Thu Nov  5 20:30:46 2026
  write: IOPS=3840, BW=15.0MiB/s (15.7MB/s)(150MiB/10001msec); 0 zone resets
    slat (nsec): min=1671, max=37464, avg=3070.24, stdev=2213.39
    clat (usec): min=169, max=9950, avg=256.42, stdev=80.14
     lat (usec): min=171, max=9954, avg=259.49, stdev=80.23
    clat percentiles (usec):
     |  1.00th=[  184],  5.00th=[  194], 10.00th=[  202], 20.00th=[  212],
     | 30.00th=[  227], 40.00th=[  241], 50.00th=[  251], 60.00th=[  262],
     | 70.00th=[  273], 80.00th=[  285], 90.00th=[  314], 95.00th=[  343],
     | 99.00th=[  433], 99.50th=[  486], 99.90th=[  644], 99.95th=[  709],
     | 99.99th=[ 1188]
   bw (  KiB/s): min=14744, max=15976, per=100.00%, avg=15368.00, stdev=381.48, samples=20
   iops        : min= 3686, max= 3994, avg=3841.90, stdev=95.39, samples=20
  lat (usec)   : 250=48.37%, 500=51.20%, 750=0.39%, 1000=0.02%
  lat (msec)   : 2=0.01%, 10=0.01%
  cpu          : usr=3.20%, sys=9.99%, ctx=77401, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,38407,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1191MiB/s (1249MB/s), 1191MiB/s-1191MiB/s (1249MB/s-1249MB/s), io=11.6GiB (12.5GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=15.0MiB/s (15.7MB/s), 15.0MiB/s-15.0MiB/s (15.7MB/s-15.7MB/s), io=150MiB (157MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=5/98540, sectors=40/2598592, merge=0/148777, ticks=145/15197, in_queue=15342, util=35.50%
```

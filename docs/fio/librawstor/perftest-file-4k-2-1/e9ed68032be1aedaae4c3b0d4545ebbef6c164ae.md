[&lt; back](..)

# perftest-file-4k-2-1

2026-11-06 23:18:25

refs/heads/docs-index-diagram

[e9ed680](https://github.com/rawstor/librawstor/commit/e9ed68032be1aedaae4c3b0d4545ebbef6c164ae)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15518: Fri Nov  6 23:17:03 2026
  read: IOPS=378k, BW=1478MiB/s (1550MB/s)(14.4GiB/10001msec)
    slat (nsec): min=500, max=28032, avg=609.41, stdev=255.87
    clat (nsec): min=3698, max=82574, avg=4446.46, stdev=735.39
     lat (nsec): min=4309, max=83125, avg=5055.87, stdev=790.07
    clat percentiles (nsec):
     |  1.00th=[ 4192],  5.00th=[ 4192], 10.00th=[ 4256], 20.00th=[ 4320],
     | 30.00th=[ 4320], 40.00th=[ 4320], 50.00th=[ 4384], 60.00th=[ 4384],
     | 70.00th=[ 4448], 80.00th=[ 4448], 90.00th=[ 4576], 95.00th=[ 4640],
     | 99.00th=[ 5216], 99.50th=[ 7840], 99.90th=[13888], 99.95th=[18560],
     | 99.99th=[22912]
   bw (  MiB/s): min= 1465, max= 1504, per=100.00%, avg=1478.93, stdev=11.12, samples=20
   iops        : min=375152, max=385184, avg=378606.40, stdev=2845.52, samples=20
  lat (usec)   : 4=0.01%, 10=99.55%, 20=0.42%, 50=0.04%, 100=0.01%
  cpu          : usr=51.95%, sys=48.03%, ctx=62, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3784792,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15521: Fri Nov  6 23:17:03 2026
  write: IOPS=4610, BW=18.0MiB/s (18.9MB/s)(180MiB/10001msec); 0 zone resets
    slat (nsec): min=1033, max=24827, avg=2840.76, stdev=1278.36
    clat (usec): min=234, max=12133, avg=429.65, stdev=200.38
     lat (usec): min=237, max=12136, avg=432.49, stdev=200.28
    clat percentiles (usec):
     |  1.00th=[  262],  5.00th=[  277], 10.00th=[  289], 20.00th=[  318],
     | 30.00th=[  343], 40.00th=[  363], 50.00th=[  383], 60.00th=[  412],
     | 70.00th=[  465], 80.00th=[  545], 90.00th=[  611], 95.00th=[  660],
     | 99.00th=[  816], 99.50th=[ 1004], 99.90th=[ 2704], 99.95th=[ 3752],
     | 99.99th=[ 6259]
   bw (  KiB/s): min=17840, max=18861, per=100.00%, avg=18448.25, stdev=300.70, samples=20
   iops        : min= 4460, max= 4715, avg=4612.00, stdev=75.21, samples=20
  lat (usec)   : 250=0.10%, 500=74.23%, 750=24.09%, 1000=1.08%
  lat (msec)   : 2=0.35%, 4=0.11%, 10=0.04%, 20=0.01%
  cpu          : usr=4.11%, sys=4.59%, ctx=48760, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,46111,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=1478MiB/s (1550MB/s), 1478MiB/s-1478MiB/s (1550MB/s-1550MB/s), io=14.4GiB (15.5GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=18.0MiB/s (18.9MB/s), 18.0MiB/s-18.0MiB/s (18.9MB/s-18.9MB/s), io=180MiB (189MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=7/111848, sectors=104/2903104, merge=0/176107, ticks=10/15914, in_queue=15924, util=35.11%
```

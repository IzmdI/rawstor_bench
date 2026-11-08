[&lt; back](..)

# perftest-file-4k-1-1

2026-11-08 14:31:32

refs/heads/worktree-snapshot-barrier

[80d9f80](https://github.com/rawstor/librawstor/commit/80d9f80ce896a0da4be1fa6bbd2db4eac3bd73a2)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15596: Sun Nov  8 14:30:47 2026
  read: IOPS=378k, BW=1478MiB/s (1550MB/s)(14.4GiB/10001msec)
    slat (nsec): min=290, max=44583, avg=331.94, stdev=191.47
    clat (nsec): min=1713, max=72716, avg=2074.69, stdev=487.46
     lat (nsec): min=2034, max=73046, avg=2406.63, stdev=528.91
    clat percentiles (nsec):
     |  1.00th=[ 1880],  5.00th=[ 1912], 10.00th=[ 1944], 20.00th=[ 1976],
     | 30.00th=[ 2008], 40.00th=[ 2008], 50.00th=[ 2040], 60.00th=[ 2064],
     | 70.00th=[ 2064], 80.00th=[ 2096], 90.00th=[ 2160], 95.00th=[ 2256],
     | 99.00th=[ 2480], 99.50th=[ 3216], 99.90th=[11072], 99.95th=[11456],
     | 99.99th=[17280]
   bw (  MiB/s): min= 1468, max= 1483, per=100.00%, avg=1479.08, stdev= 3.96, samples=20
   iops        : min=375813, max=379678, avg=378645.30, stdev=1013.97, samples=20
  lat (usec)   : 2=29.66%, 4=70.06%, 10=0.08%, 20=0.20%, 50=0.01%
  lat (usec)   : 100=0.01%
  cpu          : usr=36.93%, sys=63.06%, ctx=67, majf=0, minf=37
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3784673,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15601: Sun Nov  8 14:30:47 2026
  write: IOPS=2805, BW=11.0MiB/s (11.5MB/s)(110MiB/10001msec); 0 zone resets
    slat (nsec): min=1112, max=23083, avg=2165.15, stdev=893.05
    clat (usec): min=246, max=10820, avg=352.96, stdev=182.58
     lat (usec): min=247, max=10823, avg=355.13, stdev=182.59
    clat percentiles (usec):
     |  1.00th=[  258],  5.00th=[  269], 10.00th=[  277], 20.00th=[  293],
     | 30.00th=[  314], 40.00th=[  330], 50.00th=[  338], 60.00th=[  347],
     | 70.00th=[  355], 80.00th=[  371], 90.00th=[  400], 95.00th=[  449],
     | 99.00th=[  725], 99.50th=[ 1434], 99.90th=[ 2212], 99.95th=[ 3261],
     | 99.99th=[ 6849]
   bw (  KiB/s): min=10560, max=12000, per=100.00%, avg=11228.05, stdev=409.74, samples=20
   iops        : min= 2640, max= 3000, avg=2806.95, stdev=102.47, samples=20
  lat (usec)   : 250=0.11%, 500=96.58%, 750=2.38%, 1000=0.26%
  lat (msec)   : 2=0.48%, 4=0.14%, 10=0.05%, 20=0.01%
  cpu          : usr=2.15%, sys=2.46%, ctx=28061, majf=0, minf=37
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,28061,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1478MiB/s (1550MB/s), 1478MiB/s-1478MiB/s (1550MB/s-1550MB/s), io=14.4GiB (15.5GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=11.0MiB/s (11.5MB/s), 11.0MiB/s-11.0MiB/s (11.5MB/s-11.5MB/s), io=110MiB (115MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=8/71547, sectors=64/2043896, merge=0/108482, ticks=58/11588, in_queue=11646, util=36.04%
```

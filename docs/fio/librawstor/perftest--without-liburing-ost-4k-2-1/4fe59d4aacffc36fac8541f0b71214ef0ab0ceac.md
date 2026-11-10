[&lt; back](..)

# perftest--without-liburing-ost-4k-2-1

2026-11-10 21:05:08

refs/heads/worktree-security-design-doc

[4fe59d4](https://github.com/rawstor/librawstor/commit/4fe59d4aacffc36fac8541f0b71214ef0ab0ceac)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15625: Tue Nov 10 21:04:44 2026
  read: IOPS=24.5k, BW=95.8MiB/s (100MB/s)(958MiB/10001msec)
    slat (nsec): min=391, max=204459, avg=1052.85, stdev=928.02
    clat (usec): min=33, max=4581, avg=79.80, stdev=37.27
     lat (usec): min=34, max=4582, avg=80.86, stdev=37.32
    clat percentiles (usec):
     |  1.00th=[   49],  5.00th=[   57], 10.00th=[   60], 20.00th=[   65],
     | 30.00th=[   69], 40.00th=[   73], 50.00th=[   76], 60.00th=[   80],
     | 70.00th=[   84], 80.00th=[   89], 90.00th=[   99], 95.00th=[  117],
     | 99.00th=[  163], 99.50th=[  182], 99.90th=[  326], 99.95th=[  537],
     | 99.99th=[ 1729]
   bw (  KiB/s): min=91560, max=103302, per=100.00%, avg=98156.75, stdev=3730.50, samples=20
   iops        : min=22890, max=25825, avg=24539.05, stdev=932.64, samples=20
  lat (usec)   : 50=1.48%, 100=89.29%, 250=9.08%, 500=0.09%, 750=0.02%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.02%, 4=0.01%, 10=0.01%
  cpu          : usr=25.31%, sys=29.77%, ctx=131097, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=245286,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15628: Tue Nov 10 21:04:44 2026
  write: IOPS=4294, BW=16.8MiB/s (17.6MB/s)(168MiB/10001msec); 0 zone resets
    slat (nsec): min=847, max=305080, avg=3207.39, stdev=2665.01
    clat (usec): min=269, max=6030, avg=461.03, stdev=169.29
     lat (usec): min=271, max=6034, avg=464.23, stdev=169.24
    clat percentiles (usec):
     |  1.00th=[  306],  5.00th=[  326], 10.00th=[  343], 20.00th=[  363],
     | 30.00th=[  383], 40.00th=[  400], 50.00th=[  416], 60.00th=[  441],
     | 70.00th=[  474], 80.00th=[  537], 90.00th=[  635], 95.00th=[  701],
     | 99.00th=[ 1057], 99.50th=[ 1319], 99.90th=[ 2147], 99.95th=[ 2737],
     | 99.99th=[ 3818]
   bw (  KiB/s): min=16376, max=17968, per=100.00%, avg=17185.65, stdev=486.38, samples=20
   iops        : min= 4094, max= 4492, avg=4296.30, stdev=121.51, samples=20
  lat (usec)   : 500=75.03%, 750=21.75%, 1000=2.10%
  lat (msec)   : 2=0.99%, 4=0.12%, 10=0.01%
  cpu          : usr=8.30%, sys=8.62%, ctx=36234, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,42948,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=95.8MiB/s (100MB/s), 95.8MiB/s-95.8MiB/s (100MB/s-100MB/s), io=958MiB (1005MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=16.8MiB/s (17.6MB/s), 16.8MiB/s-16.8MiB/s (17.6MB/s-17.6MB/s), io=168MiB (176MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=3/103771, sectors=232/2224920, merge=0/153688, ticks=2/12067, in_queue=12069, util=29.44%
```

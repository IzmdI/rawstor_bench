[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-1-1

2025-09-01T19:25:39+00:00

refs/heads/feat/no_poll

[4eb396be97e21286bfef4fecb55bdf7fbc0494dd](https://github.com/rawstor/librawstor/commit/4eb396be97e21286bfef4fecb55bdf7fbc0494dd)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9948: Mon Sep  1 19:25:38 2025
  read: IOPS=16.7k, BW=65.1MiB/s (68.2MB/s)(651MiB/10001msec)
    slat (nsec): min=20, max=16260, avg=65.10, stdev=106.76
    clat (usec): min=14, max=7095, avg=28.43, stdev=18.23
     lat (usec): min=14, max=7096, avg=28.50, stdev=18.24
    clat percentiles (usec):
     |  1.00th=[   22],  5.00th=[   23], 10.00th=[   24], 20.00th=[   25],
     | 30.00th=[   25], 40.00th=[   26], 50.00th=[   27], 60.00th=[   29],
     | 70.00th=[   30], 80.00th=[   32], 90.00th=[   36], 95.00th=[   39],
     | 99.00th=[   49], 99.50th=[   52], 99.90th=[   63], 99.95th=[   82],
     | 99.99th=[  131]
   bw (  KiB/s): min=59120, max=77600, per=99.66%, avg=66388.63, stdev=5366.78, samples=19
   iops        : min=14780, max=19400, avg=16597.16, stdev=1341.70, samples=19
  write: IOPS=16.6k, BW=65.0MiB/s (68.2MB/s)(650MiB/10001msec); 0 zone resets
    slat (nsec): min=40, max=16161, avg=89.46, stdev=102.44
    clat (usec): min=16, max=6592, avg=30.32, stdev=16.86
     lat (usec): min=16, max=6592, avg=30.41, stdev=16.87
    clat percentiles (usec):
     |  1.00th=[   24],  5.00th=[   25], 10.00th=[   26], 20.00th=[   27],
     | 30.00th=[   28], 40.00th=[   29], 50.00th=[   29], 60.00th=[   30],
     | 70.00th=[   32], 80.00th=[   35], 90.00th=[   37], 95.00th=[   39],
     | 99.00th=[   48], 99.50th=[   50], 99.90th=[   57], 99.95th=[   61],
     | 99.99th=[  115]
   bw (  KiB/s): min=59592, max=76808, per=99.81%, avg=66440.84, stdev=5426.78, samples=19
   iops        : min=14898, max=19202, avg=16610.21, stdev=1356.69, samples=19
  lat (usec)   : 20=0.07%, 50=99.30%, 100=0.61%, 250=0.02%, 750=0.01%
  lat (msec)   : 10=0.01%
  cpu          : usr=9.38%, sys=28.17%, ctx=333825, majf=0, minf=574
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=166547,166429,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=65.1MiB/s (68.2MB/s), 65.1MiB/s-65.1MiB/s (68.2MB/s-68.2MB/s), io=651MiB (682MB), run=10001-10001msec
  WRITE: bw=65.0MiB/s (68.2MB/s), 65.0MiB/s-65.0MiB/s (68.2MB/s-68.2MB/s), io=650MiB (682MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/276, sectors=0/37656, merge=0/1352, ticks=0/823, in_queue=828, util=0.19%
```

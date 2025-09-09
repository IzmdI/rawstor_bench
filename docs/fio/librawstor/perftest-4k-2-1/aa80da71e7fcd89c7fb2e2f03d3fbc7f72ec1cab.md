[&lt; back](..)

# perftest-4k-2-1

2025-09-09 20:03:45

refs/heads/main

[aa80da7](https://github.com/rawstor/librawstor/commit/aa80da71e7fcd89c7fb2e2f03d3fbc7f72ec1cab)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=11259: Tue Sep  9 20:03:42 2025
  read: IOPS=11.1k, BW=43.2MiB/s (45.3MB/s)(432MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10105, avg=5091.69, stdev=2919.04
     lat (usec): min=30, max=32250, avg=79.45, stdev=325.33
    clat percentiles (msec):
     |  1.00th=[  224],  5.00th=[  592], 10.00th=[ 1045], 20.00th=[ 2039],
     | 30.00th=[ 3037], 40.00th=[ 4044], 50.00th=[ 5134], 60.00th=[ 6141],
     | 70.00th=[ 7148], 80.00th=[ 8154], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=41368, max=48968, per=100.00%, avg=44251.60, stdev=1944.91, samples=20
   iops        : min=10342, max=12242, avg=11062.90, stdev=486.23, samples=20
  write: IOPS=11.0k, BW=43.1MiB/s (45.2MB/s)(431MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10105, avg=5094.44, stdev=2921.67
     lat (usec): min=39, max=32307, avg=99.04, stdev=213.63
    clat percentiles (msec):
     |  1.00th=[  218],  5.00th=[  592], 10.00th=[ 1053], 20.00th=[ 2039],
     | 30.00th=[ 3004], 40.00th=[ 4077], 50.00th=[ 5134], 60.00th=[ 6141],
     | 70.00th=[ 7148], 80.00th=[ 8154], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=40640, max=49672, per=100.00%, avg=44132.40, stdev=2409.22, samples=20
   iops        : min=10160, max=12418, avg=11033.10, stdev=602.31, samples=20
  lat (msec)   : 250=1.29%, 500=2.68%, 750=2.75%, 1000=2.75%, 2000=10.05%
  lat (msec)   : >=2000=80.48%
  cpu          : usr=8.23%, sys=51.85%, ctx=146114, majf=0, minf=283
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=110629,110331,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=43.2MiB/s (45.3MB/s), 43.2MiB/s-43.2MiB/s (45.3MB/s-45.3MB/s), io=432MiB (453MB), run=10001-10001msec
  WRITE: bw=43.1MiB/s (45.2MB/s), 43.1MiB/s-43.1MiB/s (45.2MB/s-45.2MB/s), io=431MiB (452MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/226, sectors=0/39600, merge=0/1145, ticks=0/233, in_queue=239, util=0.21%
```

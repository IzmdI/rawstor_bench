[&lt; back](..)

# perftest-4k-1-1

2025-09-09 20:03:47

refs/heads/main

[aa80da7](https://github.com/rawstor/librawstor/commit/aa80da71e7fcd89c7fb2e2f03d3fbc7f72ec1cab)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=11285: Tue Sep  9 20:03:45 2025
  read: IOPS=6262, BW=24.5MiB/s (25.7MB/s)(245MiB/10001msec)
    slat (nsec): min=30, max=16402, avg=164.51, stdev=223.86
    clat (usec): min=38, max=26605, avg=66.90, stdev=193.89
     lat (usec): min=38, max=26605, avg=67.06, stdev=193.90
    clat percentiles (usec):
     |  1.00th=[   50],  5.00th=[   52], 10.00th=[   55], 20.00th=[   58],
     | 30.00th=[   60], 40.00th=[   62], 50.00th=[   64], 60.00th=[   67],
     | 70.00th=[   69], 80.00th=[   73], 90.00th=[   78], 95.00th=[   84],
     | 99.00th=[   98], 99.50th=[  105], 99.90th=[  135], 99.95th=[  165],
     | 99.99th=[ 1975]
   bw (  KiB/s): min=23416, max=27936, per=99.91%, avg=25029.89, stdev=1302.38, samples=19
   iops        : min= 5854, max= 6984, avg=6257.47, stdev=325.60, samples=19
  write: IOPS=6236, BW=24.4MiB/s (25.5MB/s)(244MiB/10001msec); 0 zone resets
    slat (nsec): min=60, max=16652, avg=227.46, stdev=221.93
    clat (usec): min=56, max=25111, avg=89.82, stdev=167.13
     lat (usec): min=56, max=25111, avg=90.05, stdev=167.13
    clat percentiles (usec):
     |  1.00th=[   71],  5.00th=[   75], 10.00th=[   78], 20.00th=[   81],
     | 30.00th=[   83], 40.00th=[   85], 50.00th=[   87], 60.00th=[   90],
     | 70.00th=[   92], 80.00th=[   96], 90.00th=[  102], 95.00th=[  108],
     | 99.00th=[  123], 99.50th=[  133], 99.90th=[  167], 99.95th=[  212],
     | 99.99th=[  498]
   bw (  KiB/s): min=22480, max=27904, per=100.00%, avg=24964.63, stdev=1320.20, samples=19
   iops        : min= 5620, max= 6976, avg=6241.16, stdev=330.05, samples=19
  lat (usec)   : 50=0.75%, 100=92.77%, 250=6.46%, 500=0.02%, 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 10=0.01%, 50=0.01%
  cpu          : usr=6.12%, sys=34.71%, ctx=125096, majf=0, minf=285
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=62635,62370,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=24.5MiB/s (25.7MB/s), 24.5MiB/s-24.5MiB/s (25.7MB/s-25.7MB/s), io=245MiB (257MB), run=10001-10001msec
  WRITE: bw=24.4MiB/s (25.5MB/s), 24.4MiB/s-24.4MiB/s (25.5MB/s-25.5MB/s), io=244MiB (255MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/290, sectors=0/42312, merge=0/1247, ticks=0/307, in_queue=313, util=0.21%
```

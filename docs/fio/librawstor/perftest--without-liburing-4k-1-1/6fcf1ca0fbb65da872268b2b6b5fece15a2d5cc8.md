[&lt; back](..)

# perftest--without-liburing-4k-1-1

2025-09-12 22:46:45

refs/heads/feat/evqueue

[6fcf1ca](https://github.com/rawstor/librawstor/commit/6fcf1ca0fbb65da872268b2b6b5fece15a2d5cc8)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=11371: Fri Sep 12 22:46:43 2025
  read: IOPS=5950, BW=23.2MiB/s (24.4MB/s)(232MiB/10001msec)
    slat (nsec): min=31, max=14697, avg=142.49, stdev=168.37
    clat (usec): min=42, max=28919, avg=70.07, stdev=179.19
     lat (usec): min=42, max=28919, avg=70.22, stdev=179.19
    clat percentiles (usec):
     |  1.00th=[   52],  5.00th=[   56], 10.00th=[   58], 20.00th=[   61],
     | 30.00th=[   63], 40.00th=[   66], 50.00th=[   68], 60.00th=[   70],
     | 70.00th=[   73], 80.00th=[   76], 90.00th=[   82], 95.00th=[   88],
     | 99.00th=[  102], 99.50th=[  111], 99.90th=[  131], 99.95th=[  147],
     | 99.99th=[ 1336]
   bw (  KiB/s): min=21648, max=27024, per=100.00%, avg=23805.20, stdev=1283.54, samples=20
   iops        : min= 5412, max= 6756, avg=5951.30, stdev=320.88, samples=20
  write: IOPS=5936, BW=23.2MiB/s (24.3MB/s)(232MiB/10001msec); 0 zone resets
    slat (nsec): min=70, max=18675, avg=227.98, stdev=260.19
    clat (usec): min=54, max=29593, avg=94.57, stdev=235.94
     lat (usec): min=54, max=29593, avg=94.79, stdev=235.94
    clat percentiles (usec):
     |  1.00th=[   74],  5.00th=[   78], 10.00th=[   81], 20.00th=[   84],
     | 30.00th=[   86], 40.00th=[   89], 50.00th=[   91], 60.00th=[   94],
     | 70.00th=[   96], 80.00th=[  100], 90.00th=[  106], 95.00th=[  113],
     | 99.00th=[  126], 99.50th=[  135], 99.90th=[  165], 99.95th=[  233],
     | 99.99th=[ 7373]
   bw (  KiB/s): min=22112, max=26560, per=100.00%, avg=23746.40, stdev=1136.52, samples=20
   iops        : min= 5528, max= 6640, avg=5936.60, stdev=284.13, samples=20
  lat (usec)   : 50=0.22%, 100=89.88%, 250=9.87%, 500=0.02%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 10=0.01%, 20=0.01%, 50=0.01%
  cpu          : usr=8.11%, sys=32.03%, ctx=118958, majf=0, minf=282
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=59513,59366,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=23.2MiB/s (24.4MB/s), 23.2MiB/s-23.2MiB/s (24.4MB/s-24.4MB/s), io=232MiB (244MB), run=10001-10001msec
  WRITE: bw=23.2MiB/s (24.3MB/s), 23.2MiB/s-23.2MiB/s (24.3MB/s-24.3MB/s), io=232MiB (243MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/145, sectors=0/41760, merge=0/1014, ticks=0/229, in_queue=235, util=0.15%
```

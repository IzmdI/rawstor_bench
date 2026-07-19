[&lt; back](..)

# perftest--without-liburing-ost-legacy-4k-1-1

2026-07-14 21:11:59

refs/heads/add/sources-test

[ccadbe1](https://github.com/rawstor/librawstor/commit/ccadbe1b8fc4a4e9f0d7eef10cd5cfc1bfda1841)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=12538: Tue Jul 14 21:11:44 2026
  read: IOPS=8706, BW=34.0MiB/s (35.7MB/s)(340MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=107, max=10106, avg=5089.95, stdev=2889.76
     lat (usec): min=80, max=41218, avg=113.68, stdev=236.00
    clat percentiles (msec):
     |  1.00th=[  205],  5.00th=[  575], 10.00th=[ 1083], 20.00th=[ 2089],
     | 30.00th=[ 3104], 40.00th=[ 4077], 50.00th=[ 5134], 60.00th=[ 6074],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=31752, max=36459, per=100.00%, avg=34930.89, stdev=1144.12, samples=19
   iops        : min= 7938, max= 9114, avg=8732.58, stdev=285.92, samples=19
  lat (msec)   : 250=1.48%, 500=2.72%, 750=2.53%, 1000=2.34%, 2000=10.26%
  lat (msec)   : >=2000=80.67%
  cpu          : usr=14.64%, sys=59.71%, ctx=87403, majf=0, minf=2786346
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=87071,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=12552: Tue Jul 14 21:11:44 2026
  write: IOPS=6917, BW=27.0MiB/s (28.3MB/s)(270MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=10316, max=20315, avg=15288.28, stdev=2889.17
     lat (usec): min=105, max=37356, avg=143.12, stdev=243.38
    clat percentiles (msec):
     |  1.00th=[10402],  5.00th=[10805], 10.00th=[11342], 20.00th=[12281],
     | 30.00th=[13355], 40.00th=[14295], 50.00th=[15234], 60.00th=[16308],
     | 70.00th=[17113], 80.00th=[17113], 90.00th=[17113], 95.00th=[17113],
     | 99.00th=[17113], 99.50th=[17113], 99.90th=[17113], 99.95th=[17113],
     | 99.99th=[17113]
   bw (  KiB/s): min=25616, max=28984, per=100.00%, avg=27713.68, stdev=853.41, samples=19
   iops        : min= 6404, max= 7246, avg=6928.53, stdev=213.44, samples=19
  lat (msec)   : >=2000=100.00%
  cpu          : usr=12.62%, sys=50.17%, ctx=69571, majf=0, minf=2213960
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,69184,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=34.0MiB/s (35.7MB/s), 34.0MiB/s-34.0MiB/s (35.7MB/s-35.7MB/s), io=340MiB (357MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=27.0MiB/s (28.3MB/s), 27.0MiB/s-27.0MiB/s (28.3MB/s-28.3MB/s), io=270MiB (283MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/40879, sectors=0/586536, merge=0/1322, ticks=0/216578, in_queue=216581, util=9.27%
```

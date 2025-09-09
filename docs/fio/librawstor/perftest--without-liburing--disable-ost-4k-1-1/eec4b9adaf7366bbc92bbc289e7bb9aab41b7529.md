[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-1-1

2025-09-09 20:05:35

refs/heads/feat/no_poll

[eec4b9a](https://github.com/rawstor/librawstor/commit/eec4b9adaf7366bbc92bbc289e7bb9aab41b7529)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10369: Tue Sep  9 20:05:32 2025
  read: IOPS=18.0k, BW=70.4MiB/s (73.8MB/s)(704MiB/10001msec)
    slat (nsec): min=20, max=96882, avg=55.32, stdev=242.09
    clat (usec): min=12, max=6628, avg=26.31, stdev=16.22
     lat (usec): min=12, max=6629, avg=26.36, stdev=16.23
    clat percentiles (nsec):
     |  1.00th=[20608],  5.00th=[21888], 10.00th=[22656], 20.00th=[23424],
     | 30.00th=[23936], 40.00th=[24448], 50.00th=[24960], 60.00th=[25984],
     | 70.00th=[27008], 80.00th=[28544], 90.00th=[31104], 95.00th=[34560],
     | 99.00th=[43776], 99.50th=[46848], 99.90th=[57088], 99.95th=[69120],
     | 99.99th=[98816]
   bw (  KiB/s): min=67472, max=81064, per=100.00%, avg=72054.40, stdev=3529.37, samples=20
   iops        : min=16868, max=20266, avg=18013.60, stdev=882.34, samples=20
  write: IOPS=18.0k, BW=70.2MiB/s (73.6MB/s)(702MiB/10001msec); 0 zone resets
    slat (nsec): min=40, max=17483, avg=86.49, stdev=122.59
    clat (usec): min=16, max=6256, avg=28.04, stdev=15.38
     lat (usec): min=16, max=6256, avg=28.13, stdev=15.38
    clat percentiles (nsec):
     |  1.00th=[22144],  5.00th=[23680], 10.00th=[24448], 20.00th=[25472],
     | 30.00th=[26240], 40.00th=[26752], 50.00th=[27264], 60.00th=[27776],
     | 70.00th=[28544], 80.00th=[30336], 90.00th=[32128], 95.00th=[34048],
     | 99.00th=[43264], 99.50th=[45824], 99.90th=[50944], 99.95th=[55040],
     | 99.99th=[87552]
   bw (  KiB/s): min=68136, max=79904, per=100.00%, avg=71898.80, stdev=3179.11, samples=20
   iops        : min=17034, max=19976, avg=17974.70, stdev=794.78, samples=20
  lat (usec)   : 20=0.28%, 50=99.52%, 100=0.19%, 250=0.01%, 500=0.01%
  lat (usec)   : 750=0.01%
  lat (msec)   : 10=0.01%
  cpu          : usr=9.51%, sys=28.53%, ctx=360724, majf=0, minf=586
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=180136,179747,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=70.4MiB/s (73.8MB/s), 70.4MiB/s-70.4MiB/s (73.8MB/s-73.8MB/s), io=704MiB (738MB), run=10001-10001msec
  WRITE: bw=70.2MiB/s (73.6MB/s), 70.2MiB/s-70.2MiB/s (73.6MB/s-73.6MB/s), io=702MiB (736MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/95, sectors=0/163152, merge=0/3, ticks=0/846, in_queue=846, util=0.14%
```

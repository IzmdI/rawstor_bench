[&lt; back](..)

# perftest-file-4k-1-1

2026-11-13 10:18:16

refs/heads/add/tenants

[d81fa26](https://github.com/rawstor/librawstor/commit/d81fa26a8eaadcb25b9541e1b6922ae2aafbfe68)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15517: Fri Nov 13 10:17:34 2026
  read: IOPS=603k, BW=2355MiB/s (2470MB/s)(23.0GiB/10001msec)
    slat (nsec): min=200, max=91285, avg=250.54, stdev=186.68
    clat (nsec): min=701, max=74057, avg=1243.31, stdev=398.69
     lat (nsec): min=914, max=94259, avg=1493.85, stdev=450.62
    clat percentiles (nsec):
     |  1.00th=[ 1032],  5.00th=[ 1096], 10.00th=[ 1128], 20.00th=[ 1144],
     | 30.00th=[ 1176], 40.00th=[ 1192], 50.00th=[ 1224], 60.00th=[ 1240],
     | 70.00th=[ 1272], 80.00th=[ 1304], 90.00th=[ 1352], 95.00th=[ 1384],
     | 99.00th=[ 1528], 99.50th=[ 1656], 99.90th=[ 9792], 99.95th=[10176],
     | 99.99th=[15296]
   bw (  MiB/s): min= 2329, max= 2372, per=100.00%, avg=2356.85, stdev=12.73, samples=20
   iops        : min=596296, max=607366, avg=603354.35, stdev=3259.52, samples=20
  lat (nsec)   : 750=0.01%, 1000=0.35%
  lat (usec)   : 2=99.38%, 4=0.11%, 10=0.08%, 20=0.07%, 50=0.01%
  lat (usec)   : 100=0.01%
  cpu          : usr=40.75%, sys=59.24%, ctx=62, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=6030580,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15523: Fri Nov 13 10:17:34 2026
  write: IOPS=2177, BW=8710KiB/s (8919kB/s)(85.1MiB/10001msec); 0 zone resets
    slat (nsec): min=845, max=36241, avg=1286.33, stdev=1112.91
    clat (usec): min=289, max=71727, avg=457.43, stdev=827.95
     lat (usec): min=290, max=71730, avg=458.71, stdev=828.02
    clat percentiles (usec):
     |  1.00th=[  326],  5.00th=[  347], 10.00th=[  363], 20.00th=[  383],
     | 30.00th=[  400], 40.00th=[  416], 50.00th=[  433], 60.00th=[  445],
     | 70.00th=[  461], 80.00th=[  486], 90.00th=[  519], 95.00th=[  553],
     | 99.00th=[  709], 99.50th=[  840], 99.90th=[ 1909], 99.95th=[10159],
     | 99.99th=[41157]
   bw (  KiB/s): min= 4376, max= 9824, per=100.00%, avg=8713.40, stdev=1202.86, samples=20
   iops        : min= 1094, max= 2456, avg=2178.30, stdev=300.70, samples=20
  lat (usec)   : 500=84.96%, 750=14.26%, 1000=0.49%
  lat (msec)   : 2=0.19%, 4=0.01%, 10=0.04%, 20=0.02%, 50=0.02%
  lat (msec)   : 100=0.01%
  cpu          : usr=1.33%, sys=1.21%, ctx=21892, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,21776,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=2355MiB/s (2470MB/s), 2355MiB/s-2355MiB/s (2470MB/s-2470MB/s), io=23.0GiB (24.7GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=8710KiB/s (8919kB/s), 8710KiB/s-8710KiB/s (8919kB/s-8919kB/s), io=85.1MiB (89.2MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=8/57209, sectors=272/1771824, merge=0/85088, ticks=24/70822, in_queue=70847, util=43.26%
```

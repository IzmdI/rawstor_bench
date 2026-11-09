[&lt; back](..)

# perftest--without-liburing-ost-4k-2-1

2026-11-09 20:19:07

refs/heads/add/vhost-live-migration

[91e8ca5](https://github.com/rawstor/librawstor/commit/91e8ca5f7fbbbcbed180eece1290ea53038e75ec)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15685: Mon Nov  9 20:18:46 2026
  read: IOPS=22.6k, BW=88.2MiB/s (92.5MB/s)(883MiB/10001msec)
    slat (nsec): min=370, max=99717, avg=913.51, stdev=662.43
    clat (usec): min=42, max=2393, avg=86.96, stdev=27.54
     lat (usec): min=43, max=2394, avg=87.87, stdev=27.55
    clat percentiles (usec):
     |  1.00th=[   61],  5.00th=[   67], 10.00th=[   70], 20.00th=[   73],
     | 30.00th=[   76], 40.00th=[   79], 50.00th=[   81], 60.00th=[   84],
     | 70.00th=[   88], 80.00th=[   94], 90.00th=[  104], 95.00th=[  149],
     | 99.00th=[  194], 99.50th=[  215], 99.90th=[  249], 99.95th=[  265],
     | 99.99th=[  562]
   bw (  KiB/s): min=84912, max=95728, per=100.00%, avg=90416.70, stdev=2594.32, samples=20
   iops        : min=21228, max=23932, avg=22604.05, stdev=648.60, samples=20
  lat (usec)   : 50=0.18%, 100=87.25%, 250=12.48%, 500=0.08%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%
  cpu          : usr=21.63%, sys=40.65%, ctx=122027, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=225928,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15691: Mon Nov  9 20:18:46 2026
  write: IOPS=4363, BW=17.0MiB/s (17.9MB/s)(170MiB/10001msec); 0 zone resets
    slat (nsec): min=761, max=30165, avg=2781.86, stdev=1681.19
    clat (usec): min=251, max=3578, avg=454.10, stdev=155.20
     lat (usec): min=253, max=3580, avg=456.89, stdev=155.07
    clat percentiles (usec):
     |  1.00th=[  285],  5.00th=[  306], 10.00th=[  318], 20.00th=[  343],
     | 30.00th=[  363], 40.00th=[  383], 50.00th=[  404], 60.00th=[  437],
     | 70.00th=[  498], 80.00th=[  570], 90.00th=[  644], 95.00th=[  709],
     | 99.00th=[  898], 99.50th=[ 1205], 99.90th=[ 1876], 99.95th=[ 2057],
     | 99.99th=[ 2802]
   bw (  KiB/s): min=16376, max=18208, per=100.00%, avg=17463.45, stdev=450.32, samples=20
   iops        : min= 4094, max= 4552, avg=4365.75, stdev=112.51, samples=20
  lat (usec)   : 500=70.39%, 750=26.57%, 1000=2.28%
  lat (msec)   : 2=0.69%, 4=0.07%
  cpu          : usr=6.31%, sys=11.65%, ctx=35881, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,43640,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=88.2MiB/s (92.5MB/s), 88.2MiB/s-88.2MiB/s (92.5MB/s-92.5MB/s), io=883MiB (925MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=17.0MiB/s (17.9MB/s), 17.0MiB/s-17.0MiB/s (17.9MB/s-17.9MB/s), io=170MiB (179MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=4/105765, sectors=32/2254376, merge=0/155991, ticks=5/10177, in_queue=10182, util=28.32%
```

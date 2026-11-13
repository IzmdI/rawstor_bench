[&lt; back](..)

# perftest-ost-4k-2-1

2026-11-13 10:18:16

refs/heads/add/tenants

[d81fa26](https://github.com/rawstor/librawstor/commit/d81fa26a8eaadcb25b9541e1b6922ae2aafbfe68)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15524: Fri Nov 13 10:17:18 2026
  read: IOPS=73.5k, BW=287MiB/s (301MB/s)(2871MiB/10001msec)
    slat (nsec): min=260, max=42393, avg=364.30, stdev=204.61
    clat (usec): min=15, max=726, avg=26.62, stdev= 6.76
     lat (usec): min=15, max=726, avg=26.98, stdev= 6.78
    clat percentiles (nsec):
     |  1.00th=[16064],  5.00th=[16512], 10.00th=[17280], 20.00th=[22400],
     | 30.00th=[23680], 40.00th=[24704], 50.00th=[25472], 60.00th=[27264],
     | 70.00th=[28800], 80.00th=[31360], 90.00th=[35072], 95.00th=[37632],
     | 99.00th=[45824], 99.50th=[49920], 99.90th=[59136], 99.95th=[62720],
     | 99.99th=[74240]
   bw (  KiB/s): min=236184, max=306072, per=100.00%, avg=294132.15, stdev=16138.74, samples=20
   iops        : min=59046, max=76518, avg=73533.05, stdev=4034.65, samples=20
  lat (usec)   : 20=14.33%, 50=85.18%, 100=0.49%, 250=0.01%, 500=0.01%
  lat (usec)   : 750=0.01%
  cpu          : usr=13.06%, sys=64.74%, ctx=317916, majf=0, minf=2202
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=734981,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15531: Fri Nov 13 10:17:18 2026
  write: IOPS=5502, BW=21.5MiB/s (22.5MB/s)(215MiB/10001msec); 0 zone resets
    slat (nsec): min=531, max=23244, avg=1857.90, stdev=895.33
    clat (usec): min=227, max=20831, avg=360.56, stdev=280.26
     lat (usec): min=229, max=20834, avg=362.42, stdev=280.23
    clat percentiles (usec):
     |  1.00th=[  253],  5.00th=[  265], 10.00th=[  277], 20.00th=[  293],
     | 30.00th=[  310], 40.00th=[  318], 50.00th=[  330], 60.00th=[  343],
     | 70.00th=[  359], 80.00th=[  392], 90.00th=[  469], 95.00th=[  523],
     | 99.00th=[  644], 99.50th=[  881], 99.90th=[ 2540], 99.95th=[ 3720],
     | 99.99th=[19268]
   bw (  KiB/s): min=19206, max=23064, per=100.00%, avg=22019.80, stdev=1081.07, samples=20
   iops        : min= 4801, max= 5766, avg=5504.90, stdev=270.32, samples=20
  lat (usec)   : 250=0.67%, 500=92.51%, 750=6.22%, 1000=0.14%
  lat (msec)   : 2=0.27%, 4=0.15%, 10=0.02%, 20=0.01%, 50=0.01%
  cpu          : usr=3.74%, sys=9.96%, ctx=51128, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,55029,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=287MiB/s (301MB/s), 287MiB/s-287MiB/s (301MB/s-301MB/s), io=2871MiB (3010MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=21.5MiB/s (22.5MB/s), 21.5MiB/s-21.5MiB/s (22.5MB/s-22.5MB/s), io=215MiB (225MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=28/127443, sectors=480/2782768, merge=0/199054, ticks=8/21633, in_queue=21642, util=34.41%
```

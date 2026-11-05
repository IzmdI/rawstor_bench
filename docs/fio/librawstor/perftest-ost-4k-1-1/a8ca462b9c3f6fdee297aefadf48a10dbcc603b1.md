[&lt; back](..)

# perftest-ost-4k-1-1

2026-11-05 21:00:41

refs/heads/main

[a8ca462](https://github.com/rawstor/librawstor/commit/a8ca462b9c3f6fdee297aefadf48a10dbcc603b1)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15308: Thu Nov  5 20:59:35 2026
  read: IOPS=35.9k, BW=140MiB/s (147MB/s)(1403MiB/10001msec)
    slat (nsec): min=380, max=58719, avg=471.59, stdev=285.07
    clat (usec): min=22, max=1054, avg=27.18, stdev=12.00
     lat (usec): min=22, max=1055, avg=27.65, stdev=12.02
    clat percentiles (usec):
     |  1.00th=[   25],  5.00th=[   25], 10.00th=[   25], 20.00th=[   26],
     | 30.00th=[   26], 40.00th=[   26], 50.00th=[   26], 60.00th=[   27],
     | 70.00th=[   28], 80.00th=[   28], 90.00th=[   30], 95.00th=[   32],
     | 99.00th=[   39], 99.50th=[   42], 99.90th=[  192], 99.95th=[  255],
     | 99.99th=[  627]
   bw (  KiB/s): min=113448, max=150720, per=100.00%, avg=143757.40, stdev=7962.24, samples=20
   iops        : min=28362, max=37680, avg=35939.25, stdev=1990.57, samples=20
  lat (usec)   : 50=99.81%, 100=0.08%, 250=0.07%, 500=0.03%, 750=0.02%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=7.20%, sys=40.13%, ctx=359216, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=359220,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15311: Thu Nov  5 20:59:35 2026
  write: IOPS=3217, BW=12.6MiB/s (13.2MB/s)(126MiB/10001msec); 0 zone resets
    slat (nsec): min=751, max=15593, avg=1083.41, stdev=477.62
    clat (usec): min=236, max=7781, avg=309.39, stdev=55.64
     lat (usec): min=237, max=7782, avg=310.47, stdev=55.66
    clat percentiles (usec):
     |  1.00th=[  249],  5.00th=[  260], 10.00th=[  265], 20.00th=[  277],
     | 30.00th=[  289], 40.00th=[  302], 50.00th=[  310], 60.00th=[  318],
     | 70.00th=[  326], 80.00th=[  334], 90.00th=[  347], 95.00th=[  363],
     | 99.00th=[  424], 99.50th=[  474], 99.90th=[  578], 99.95th=[  603],
     | 99.99th=[  676]
   bw (  KiB/s): min=12328, max=13256, per=100.00%, avg=12875.75, stdev=316.24, samples=20
   iops        : min= 3082, max= 3314, avg=3218.90, stdev=79.03, samples=20
  lat (usec)   : 250=1.09%, 500=98.52%, 750=0.38%, 1000=0.01%
  lat (msec)   : 10=0.01%
  cpu          : usr=0.88%, sys=4.08%, ctx=32179, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,32178,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=140MiB/s (147MB/s), 140MiB/s-140MiB/s (147MB/s-147MB/s), io=1403MiB (1471MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=12.6MiB/s (13.2MB/s), 12.6MiB/s-12.6MiB/s (13.2MB/s-13.2MB/s), io=126MiB (132MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=4/82315, sectors=32/1814104, merge=0/123933, ticks=4/15473, in_queue=15477, util=36.38%
```

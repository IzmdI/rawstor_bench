[&lt; back](..)

# perftest-file-4k-1-1

2026-11-05 20:32:29

refs/heads/add/cli-output-format

[fd5bd2e](https://github.com/rawstor/librawstor/commit/fd5bd2eeee5c6c7df76ffb1122a84fbc1824cf7e)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15562: Thu Nov  5 20:31:07 2026
  read: IOPS=295k, BW=1154MiB/s (1210MB/s)(11.3GiB/10001msec)
    slat (nsec): min=530, max=59962, avg=633.06, stdev=297.27
    clat (nsec): min=1983, max=62477, avg=2499.86, stdev=598.23
     lat (nsec): min=2554, max=63519, avg=3132.92, stdev=675.63
    clat percentiles (nsec):
     |  1.00th=[ 2224],  5.00th=[ 2288], 10.00th=[ 2320], 20.00th=[ 2384],
     | 30.00th=[ 2416], 40.00th=[ 2416], 50.00th=[ 2448], 60.00th=[ 2480],
     | 70.00th=[ 2512], 80.00th=[ 2544], 90.00th=[ 2640], 95.00th=[ 2736],
     | 99.00th=[ 2992], 99.50th=[ 3696], 99.90th=[12224], 99.95th=[13504],
     | 99.99th=[20608]
   bw (  MiB/s): min= 1135, max= 1186, per=100.00%, avg=1154.82, stdev=12.61, samples=20
   iops        : min=290661, max=303725, avg=295633.90, stdev=3229.37, samples=20
  lat (usec)   : 2=0.01%, 4=99.61%, 10=0.14%, 20=0.24%, 50=0.01%
  lat (usec)   : 100=0.01%
  cpu          : usr=46.31%, sys=53.67%, ctx=56, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=2954570,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15567: Thu Nov  5 20:31:07 2026
  write: IOPS=2809, BW=11.0MiB/s (11.5MB/s)(110MiB/10001msec); 0 zone resets
    slat (nsec): min=1643, max=32280, avg=2790.67, stdev=1060.54
    clat (usec): min=237, max=9614, avg=351.72, stdev=183.53
     lat (usec): min=240, max=9616, avg=354.51, stdev=183.56
    clat percentiles (usec):
     |  1.00th=[  255],  5.00th=[  269], 10.00th=[  277], 20.00th=[  293],
     | 30.00th=[  310], 40.00th=[  322], 50.00th=[  334], 60.00th=[  347],
     | 70.00th=[  359], 80.00th=[  379], 90.00th=[  412], 95.00th=[  461],
     | 99.00th=[  668], 99.50th=[  947], 99.90th=[ 2180], 99.95th=[ 4752],
     | 99.99th=[ 7635]
   bw (  KiB/s): min=10608, max=11936, per=100.00%, avg=11244.35, stdev=329.56, samples=20
   iops        : min= 2652, max= 2984, avg=2811.00, stdev=82.42, samples=20
  lat (usec)   : 250=0.30%, 500=96.43%, 750=2.51%, 1000=0.28%
  lat (msec)   : 2=0.36%, 4=0.06%, 10=0.06%
  cpu          : usr=2.51%, sys=2.69%, ctx=28100, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,28100,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1154MiB/s (1210MB/s), 1154MiB/s-1154MiB/s (1210MB/s-1210MB/s), io=11.3GiB (12.1GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=11.0MiB/s (11.5MB/s), 11.0MiB/s-11.0MiB/s (11.5MB/s-11.5MB/s), io=110MiB (115MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=9/70374, sectors=72/1997160, merge=0/106683, ticks=68/12218, in_queue=12288, util=35.28%
```

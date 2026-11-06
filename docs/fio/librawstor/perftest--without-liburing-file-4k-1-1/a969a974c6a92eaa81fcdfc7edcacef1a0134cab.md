[&lt; back](..)

# perftest--without-liburing-file-4k-1-1

2026-11-06 23:04:11

refs/heads/docs-index-diagram

[a969a97](https://github.com/rawstor/librawstor/commit/a969a974c6a92eaa81fcdfc7edcacef1a0134cab)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15488: Fri Nov  6 23:03:23 2026
  read: IOPS=259k, BW=1013MiB/s (1063MB/s)(9.90GiB/10001msec)
    slat (nsec): min=591, max=86702, avg=727.39, stdev=339.25
    clat (nsec): min=2064, max=127457, avg=2879.18, stdev=735.93
     lat (nsec): min=2705, max=128179, avg=3606.58, stdev=824.54
    clat percentiles (nsec):
     |  1.00th=[ 2352],  5.00th=[ 2448], 10.00th=[ 2480], 20.00th=[ 2608],
     | 30.00th=[ 2800], 40.00th=[ 2832], 50.00th=[ 2896], 60.00th=[ 2928],
     | 70.00th=[ 2960], 80.00th=[ 2992], 90.00th=[ 3088], 95.00th=[ 3184],
     | 99.00th=[ 3504], 99.50th=[ 4576], 99.90th=[13248], 99.95th=[14656],
     | 99.99th=[22656]
   bw (  KiB/s): min=1024144, max=1047520, per=100.00%, avg=1038461.65, stdev=6237.42, samples=20
   iops        : min=256036, max=261880, avg=259615.25, stdev=1559.42, samples=20
  lat (usec)   : 4=99.30%, 10=0.40%, 20=0.29%, 50=0.02%, 100=0.01%
  lat (usec)   : 250=0.01%
  cpu          : usr=55.89%, sys=44.09%, ctx=56, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=2594670,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15491: Fri Nov  6 23:03:23 2026
  write: IOPS=3128, BW=12.2MiB/s (12.8MB/s)(122MiB/10001msec); 0 zone resets
    slat (nsec): min=1853, max=30788, avg=3019.54, stdev=1056.01
    clat (usec): min=182, max=12301, avg=315.13, stdev=186.58
     lat (usec): min=185, max=12305, avg=318.15, stdev=186.60
    clat percentiles (usec):
     |  1.00th=[  212],  5.00th=[  233], 10.00th=[  241], 20.00th=[  258],
     | 30.00th=[  273], 40.00th=[  285], 50.00th=[  293], 60.00th=[  306],
     | 70.00th=[  322], 80.00th=[  343], 90.00th=[  375], 95.00th=[  420],
     | 99.00th=[  627], 99.50th=[  848], 99.90th=[ 3130], 99.95th=[ 3326],
     | 99.99th=[ 4883]
   bw (  KiB/s): min=11424, max=13288, per=100.00%, avg=12519.85, stdev=572.66, samples=20
   iops        : min= 2856, max= 3322, avg=3129.90, stdev=143.11, samples=20
  lat (usec)   : 250=15.64%, 500=82.06%, 750=1.66%, 1000=0.24%
  lat (msec)   : 2=0.10%, 4=0.29%, 10=0.01%, 20=0.01%
  cpu          : usr=3.47%, sys=11.63%, ctx=62988, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,31287,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1013MiB/s (1063MB/s), 1013MiB/s-1013MiB/s (1063MB/s-1063MB/s), io=9.90GiB (10.6GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=12.2MiB/s (12.8MB/s), 12.2MiB/s-12.2MiB/s (12.8MB/s-12.8MB/s), io=122MiB (128MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=9/79923, sectors=72/2231304, merge=0/121021, ticks=151/14516, in_queue=14667, util=37.16%
```

[&lt; back](..)

# perftest--without-liburing-file-4k-1-1

2026-11-13 10:18:16

refs/heads/add/tenants

[d81fa26](https://github.com/rawstor/librawstor/commit/d81fa26a8eaadcb25b9541e1b6922ae2aafbfe68)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15682: Fri Nov 13 10:17:34 2026
  read: IOPS=319k, BW=1245MiB/s (1305MB/s)(12.2GiB/10001msec)
    slat (nsec): min=300, max=89076, avg=408.84, stdev=276.37
    clat (nsec): min=1743, max=114523, avg=2480.31, stdev=737.51
     lat (nsec): min=2074, max=114934, avg=2889.14, stdev=815.12
    clat percentiles (nsec):
     |  1.00th=[ 1928],  5.00th=[ 2008], 10.00th=[ 2064], 20.00th=[ 2192],
     | 30.00th=[ 2352], 40.00th=[ 2416], 50.00th=[ 2448], 60.00th=[ 2480],
     | 70.00th=[ 2512], 80.00th=[ 2576], 90.00th=[ 2672], 95.00th=[ 2896],
     | 99.00th=[ 3792], 99.50th=[ 4080], 99.90th=[12096], 99.95th=[14528],
     | 99.99th=[23168]
   bw (  MiB/s): min= 1047, max= 1280, per=100.00%, avg=1245.38, stdev=67.67, samples=20
   iops        : min=268192, max=327934, avg=318817.65, stdev=17324.61, samples=20
  lat (usec)   : 2=4.12%, 4=95.30%, 10=0.32%, 20=0.24%, 50=0.01%
  lat (usec)   : 100=0.01%, 250=0.01%
  cpu          : usr=53.64%, sys=46.34%, ctx=61, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3186359,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15686: Fri Nov 13 10:17:34 2026
  write: IOPS=2882, BW=11.3MiB/s (11.8MB/s)(113MiB/10001msec); 0 zone resets
    slat (nsec): min=1402, max=39924, avg=2603.69, stdev=1056.88
    clat (usec): min=216, max=16914, avg=342.82, stdev=233.47
     lat (usec): min=218, max=16917, avg=345.42, stdev=233.50
    clat percentiles (usec):
     |  1.00th=[  231],  5.00th=[  243], 10.00th=[  251], 20.00th=[  269],
     | 30.00th=[  293], 40.00th=[  306], 50.00th=[  318], 60.00th=[  334],
     | 70.00th=[  351], 80.00th=[  371], 90.00th=[  416], 95.00th=[  474],
     | 99.00th=[  717], 99.50th=[  889], 99.90th=[ 3654], 99.95th=[ 4015],
     | 99.99th=[ 8455]
   bw (  KiB/s): min=10760, max=12496, per=100.00%, avg=11536.60, stdev=538.84, samples=20
   iops        : min= 2690, max= 3124, avg=2884.05, stdev=134.71, samples=20
  lat (usec)   : 250=9.09%, 500=86.90%, 750=3.19%, 1000=0.41%
  lat (msec)   : 2=0.13%, 4=0.24%, 10=0.05%, 20=0.01%
  cpu          : usr=2.79%, sys=10.38%, ctx=57942, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,28831,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1245MiB/s (1305MB/s), 1245MiB/s-1245MiB/s (1305MB/s-1305MB/s), io=12.2GiB (13.1GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=11.3MiB/s (11.8MB/s), 11.3MiB/s-11.3MiB/s (11.8MB/s-11.8MB/s), io=113MiB (118MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=18/72971, sectors=992/2126864, merge=28/110654, ticks=12/13814, in_queue=13827, util=38.46%
```

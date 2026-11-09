[&lt; back](..)

# perftest-ost-4k-1-1

2026-11-09 20:19:07

refs/heads/add/vhost-live-migration

[91e8ca5](https://github.com/rawstor/librawstor/commit/91e8ca5f7fbbbcbed180eece1290ea53038e75ec)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15745: Mon Nov  9 20:18:27 2026
  read: IOPS=29.7k, BW=116MiB/s (122MB/s)(1162MiB/10001msec)
    slat (nsec): min=320, max=21813, avg=468.00, stdev=258.60
    clat (usec): min=25, max=1775, avg=32.81, stdev= 6.41
     lat (usec): min=25, max=1776, avg=33.27, stdev= 6.45
    clat percentiles (usec):
     |  1.00th=[   30],  5.00th=[   30], 10.00th=[   30], 20.00th=[   30],
     | 30.00th=[   31], 40.00th=[   31], 50.00th=[   32], 60.00th=[   34],
     | 70.00th=[   34], 80.00th=[   35], 90.00th=[   37], 95.00th=[   41],
     | 99.00th=[   51], 99.50th=[   55], 99.90th=[   68], 99.95th=[   76],
     | 99.99th=[  112]
   bw (  KiB/s): min=111174, max=128088, per=100.00%, avg=119024.40, stdev=4387.06, samples=20
   iops        : min=27793, max=32022, avg=29756.00, stdev=1096.83, samples=20
  lat (usec)   : 50=98.88%, 100=1.10%, 250=0.01%, 500=0.01%, 1000=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=6.73%, sys=39.38%, ctx=297424, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=297422,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15749: Mon Nov  9 20:18:27 2026
  write: IOPS=2780, BW=10.9MiB/s (11.4MB/s)(109MiB/10028msec); 0 zone resets
    slat (nsec): min=791, max=18999, avg=1906.03, stdev=768.19
    clat (usec): min=230, max=79780, avg=356.76, stdev=807.55
     lat (usec): min=232, max=79782, avg=358.66, stdev=807.55
    clat percentiles (usec):
     |  1.00th=[  247],  5.00th=[  258], 10.00th=[  265], 20.00th=[  281],
     | 30.00th=[  297], 40.00th=[  310], 50.00th=[  318], 60.00th=[  326],
     | 70.00th=[  338], 80.00th=[  355], 90.00th=[  379], 95.00th=[  420],
     | 99.00th=[  816], 99.50th=[ 1401], 99.90th=[ 7570], 99.95th=[13042],
     | 99.99th=[40109]
   bw (  KiB/s): min= 8696, max=12513, per=100.00%, avg=11156.95, stdev=986.23, samples=20
   iops        : min= 2174, max= 3128, avg=2789.15, stdev=246.48, samples=20
  lat (usec)   : 250=1.92%, 500=95.53%, 750=1.41%, 1000=0.38%
  lat (msec)   : 2=0.39%, 4=0.16%, 10=0.13%, 20=0.04%, 50=0.03%
  lat (msec)   : 100=0.01%
  cpu          : usr=1.50%, sys=4.99%, ctx=27883, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,27882,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=116MiB/s (122MB/s), 116MiB/s-116MiB/s (122MB/s-122MB/s), io=1162MiB (1218MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=10.9MiB/s (11.4MB/s), 10.9MiB/s-10.9MiB/s (11.4MB/s-11.4MB/s), io=109MiB (114MB), run=10028-10028msec

Disk stats (read/write):
  nvme0n1: ios=2/70384, sectors=16/1570560, merge=0/105992, ticks=1/12242, in_queue=12244, util=34.21%
```

[&lt; back](..)

# perftest-ost-4k-1-1

2026-11-05 20:32:30

refs/heads/add/cli-output-format

[fd5bd2e](https://github.com/rawstor/librawstor/commit/fd5bd2eeee5c6c7df76ffb1122a84fbc1824cf7e)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15296: Thu Nov  5 20:30:44 2026
  read: IOPS=29.5k, BW=115MiB/s (121MB/s)(1151MiB/10001msec)
    slat (nsec): min=520, max=22214, avg=709.55, stdev=352.70
    clat (usec): min=27, max=441, avg=32.93, stdev= 4.41
     lat (usec): min=27, max=442, avg=33.64, stdev= 4.50
    clat percentiles (nsec):
     |  1.00th=[29056],  5.00th=[29568], 10.00th=[29568], 20.00th=[30080],
     | 30.00th=[30336], 40.00th=[30592], 50.00th=[31360], 60.00th=[32640],
     | 70.00th=[34048], 80.00th=[35072], 90.00th=[37120], 95.00th=[40704],
     | 99.00th=[49920], 99.50th=[52992], 99.90th=[60160], 99.95th=[64768],
     | 99.99th=[78336]
   bw (  KiB/s): min=109744, max=126912, per=100.00%, avg=117887.85, stdev=5055.44, samples=20
   iops        : min=27436, max=31728, avg=29471.90, stdev=1263.85, samples=20
  lat (usec)   : 50=99.01%, 100=0.99%, 250=0.01%, 500=0.01%
  cpu          : usr=8.78%, sys=38.66%, ctx=294583, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=294584,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15300: Thu Nov  5 20:30:44 2026
  write: IOPS=2827, BW=11.0MiB/s (11.6MB/s)(110MiB/10001msec); 0 zone resets
    slat (nsec): min=1222, max=19320, avg=2504.60, stdev=809.29
    clat (usec): min=234, max=25600, avg=350.18, stdev=787.68
     lat (usec): min=236, max=25602, avg=352.69, stdev=787.70
    clat percentiles (usec):
     |  1.00th=[  245],  5.00th=[  255], 10.00th=[  260], 20.00th=[  273],
     | 30.00th=[  289], 40.00th=[  306], 50.00th=[  314], 60.00th=[  318],
     | 70.00th=[  326], 80.00th=[  338], 90.00th=[  351], 95.00th=[  367],
     | 99.00th=[  603], 99.50th=[  938], 99.90th=[19792], 99.95th=[20579],
     | 99.99th=[21627]
   bw (  KiB/s): min=10624, max=12256, per=100.00%, avg=11313.60, stdev=474.44, samples=20
   iops        : min= 2656, max= 3064, avg=2828.30, stdev=118.59, samples=20
  lat (usec)   : 250=2.61%, 500=96.00%, 750=0.70%, 1000=0.22%
  lat (msec)   : 2=0.13%, 4=0.10%, 10=0.08%, 20=0.06%, 50=0.10%
  cpu          : usr=1.96%, sys=5.00%, ctx=28277, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,28275,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=115MiB/s (121MB/s), 115MiB/s-115MiB/s (121MB/s-121MB/s), io=1151MiB (1207MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=11.0MiB/s (11.6MB/s), 11.0MiB/s-11.0MiB/s (11.6MB/s-11.6MB/s), io=110MiB (116MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=2/72708, sectors=16/2303168, merge=0/107389, ticks=2/61775, in_queue=61778, util=37.56%
```

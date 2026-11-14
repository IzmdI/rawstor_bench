[&lt; back](..)

# perftest-ost-4k-1-1

2026-11-14 06:32:27

refs/heads/worktree-security-design-doc

[8d0fa24](https://github.com/rawstor/librawstor/commit/8d0fa24eb734bc5b8b5a4ebcc3894add0cf18b6c)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15654: Sat Nov 14 06:32:08 2026
  read: IOPS=50.7k, BW=198MiB/s (207MB/s)(1979MiB/10001msec)
    slat (nsec): min=277, max=26585, avg=436.76, stdev=372.75
    clat (usec): min=10, max=694, avg=19.06, stdev=11.95
     lat (usec): min=10, max=694, avg=19.50, stdev=12.01
    clat percentiles (usec):
     |  1.00th=[   11],  5.00th=[   12], 10.00th=[   12], 20.00th=[   12],
     | 30.00th=[   12], 40.00th=[   12], 50.00th=[   12], 60.00th=[   13],
     | 70.00th=[   16], 80.00th=[   37], 90.00th=[   38], 95.00th=[   41],
     | 99.00th=[   49], 99.50th=[   52], 99.90th=[   60], 99.95th=[   65],
     | 99.99th=[  114]
   bw (  KiB/s): min=104920, max=277456, per=100.00%, avg=202793.20, stdev=46321.36, samples=20
   iops        : min=26230, max=69364, avg=50698.15, stdev=11580.28, samples=20
  lat (usec)   : 20=73.05%, 50=26.15%, 100=0.79%, 250=0.01%, 500=0.01%
  lat (usec)   : 750=0.01%
  cpu          : usr=12.43%, sys=34.52%, ctx=506633, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=506635,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15656: Sat Nov 14 06:32:08 2026
  write: IOPS=4164, BW=16.3MiB/s (17.1MB/s)(163MiB/10001msec); 0 zone resets
    slat (nsec): min=583, max=31629, avg=1473.43, stdev=1322.17
    clat (usec): min=118, max=4245, avg=238.07, stdev=53.52
     lat (usec): min=119, max=4247, avg=239.54, stdev=53.58
    clat percentiles (usec):
     |  1.00th=[  169],  5.00th=[  182], 10.00th=[  192], 20.00th=[  204],
     | 30.00th=[  215], 40.00th=[  225], 50.00th=[  233], 60.00th=[  241],
     | 70.00th=[  251], 80.00th=[  265], 90.00th=[  285], 95.00th=[  306],
     | 99.00th=[  424], 99.50th=[  482], 99.90th=[  709], 99.95th=[  857],
     | 99.99th=[ 1254]
   bw (  KiB/s): min=14248, max=19176, per=100.00%, avg=16666.65, stdev=1325.23, samples=20
   iops        : min= 3562, max= 4794, avg=4166.55, stdev=331.33, samples=20
  lat (usec)   : 250=69.65%, 500=29.96%, 750=0.31%, 1000=0.06%
  lat (msec)   : 2=0.02%, 10=0.01%
  cpu          : usr=2.15%, sys=5.42%, ctx=41647, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,41645,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=198MiB/s (207MB/s), 198MiB/s-198MiB/s (207MB/s-207MB/s), io=1979MiB (2075MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=16.3MiB/s (17.1MB/s), 16.3MiB/s-16.3MiB/s (17.1MB/s-17.1MB/s), io=163MiB (171MB), run=10001-10001msec

Disk stats (read/write):
    dm-0: ios=27/290196, sectors=216/2321568, merge=0/0, ticks=54/47653, in_queue=47707, util=25.19%, aggrios=0/94594, aggsectors=108/1386520, aggrmerge=13/78720, aggrticks=1/3850, aggrin_queue=3851, aggrutil=22.23%
  nvme0n1: ios=1/0, sectors=216/0, merge=26/0, ticks=2/0, in_queue=1, util=0.01%
  nvme1n1: ios=0/189189, sectors=0/2773040, merge=0/157441, ticks=0/7701, in_queue=7702, util=22.23%
```

[&lt; back](..)

# perftest-ost-4k-2-1

2026-11-14 06:32:27

refs/heads/worktree-security-design-doc

[8d0fa24](https://github.com/rawstor/librawstor/commit/8d0fa24eb734bc5b8b5a4ebcc3894add0cf18b6c)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15469: Sat Nov 14 06:31:33 2026
  read: IOPS=74.3k, BW=290MiB/s (304MB/s)(2902MiB/10001msec)
    slat (nsec): min=260, max=30666, avg=373.06, stdev=236.99
    clat (usec): min=15, max=1048, avg=26.31, stdev= 6.60
     lat (usec): min=15, max=1048, avg=26.68, stdev= 6.61
    clat percentiles (nsec):
     |  1.00th=[16064],  5.00th=[16512], 10.00th=[17280], 20.00th=[22144],
     | 30.00th=[23680], 40.00th=[24448], 50.00th=[25216], 60.00th=[26752],
     | 70.00th=[28800], 80.00th=[31104], 90.00th=[34560], 95.00th=[36608],
     | 99.00th=[43776], 99.50th=[46848], 99.90th=[54528], 99.95th=[58112],
     | 99.99th=[70144]
   bw (  KiB/s): min=267128, max=306392, per=100.00%, avg=297282.55, stdev=10070.75, samples=20
   iops        : min=66782, max=76598, avg=74320.50, stdev=2517.70, samples=20
  lat (usec)   : 20=14.58%, 50=85.17%, 100=0.24%, 250=0.01%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=13.13%, sys=65.39%, ctx=316592, majf=0, minf=1664
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=742839,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15476: Sat Nov 14 06:31:33 2026
  write: IOPS=3720, BW=14.5MiB/s (15.2MB/s)(146MiB/10030msec); 0 zone resets
    slat (nsec): min=570, max=23215, avg=1948.07, stdev=905.72
    clat (usec): min=233, max=154459, avg=534.79, stdev=2375.66
     lat (usec): min=235, max=154462, avg=536.74, stdev=2375.66
    clat percentiles (usec):
     |  1.00th=[   258],  5.00th=[   273], 10.00th=[   285], 20.00th=[   310],
     | 30.00th=[   330], 40.00th=[   347], 50.00th=[   367], 60.00th=[   388],
     | 70.00th=[   433], 80.00th=[   494], 90.00th=[   570], 95.00th=[   652],
     | 99.00th=[  1647], 99.50th=[  5997], 99.90th=[ 40109], 99.95th=[ 52691],
     | 99.99th=[115868]
   bw (  KiB/s): min=11120, max=18448, per=100.00%, avg=14930.85, stdev=2038.36, samples=20
   iops        : min= 2780, max= 4612, avg=3732.60, stdev=509.57, samples=20
  lat (usec)   : 250=0.32%, 500=80.52%, 750=15.75%, 1000=1.31%
  lat (msec)   : 2=1.25%, 4=0.28%, 10=0.23%, 20=0.15%, 50=0.13%
  lat (msec)   : 100=0.05%, 250=0.01%
  cpu          : usr=2.52%, sys=6.85%, ctx=34776, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,37313,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=290MiB/s (304MB/s), 290MiB/s-290MiB/s (304MB/s-304MB/s), io=2902MiB (3043MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=14.5MiB/s (15.2MB/s), 14.5MiB/s-14.5MiB/s (15.2MB/s-15.2MB/s), io=146MiB (153MB), run=10030-10030msec

Disk stats (read/write):
  nvme0n1: ios=3/87022, sectors=232/1962456, merge=0/137083, ticks=3/21901, in_queue=21904, util=38.33%
```

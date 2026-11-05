[&lt; back](..)

# perftest--without-liburing-ost-4k-2-1

2026-11-05 20:32:29

refs/heads/add/cli-output-format

[fd5bd2e](https://github.com/rawstor/librawstor/commit/fd5bd2eeee5c6c7df76ffb1122a84fbc1824cf7e)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15493: Thu Nov  5 20:31:10 2026
  read: IOPS=22.5k, BW=87.7MiB/s (92.0MB/s)(877MiB/10001msec)
    slat (nsec): min=641, max=27070, avg=1226.68, stdev=728.90
    clat (usec): min=45, max=2432, avg=87.25, stdev=25.04
     lat (usec): min=46, max=2434, avg=88.47, stdev=25.04
    clat percentiles (usec):
     |  1.00th=[   61],  5.00th=[   68], 10.00th=[   70], 20.00th=[   74],
     | 30.00th=[   76], 40.00th=[   79], 50.00th=[   81], 60.00th=[   84],
     | 70.00th=[   89], 80.00th=[   94], 90.00th=[  108], 95.00th=[  147],
     | 99.00th=[  186], 99.50th=[  204], 99.90th=[  235], 99.95th=[  245],
     | 99.99th=[  265]
   bw (  KiB/s): min=87294, max=93208, per=100.00%, avg=89877.35, stdev=2041.09, samples=20
   iops        : min=21823, max=23302, avg=22469.25, stdev=510.32, samples=20
  lat (usec)   : 50=0.25%, 100=86.21%, 250=13.51%, 500=0.03%, 750=0.01%
  lat (msec)   : 4=0.01%
  cpu          : usr=23.05%, sys=40.87%, ctx=120529, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=224584,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15498: Thu Nov  5 20:31:10 2026
  write: IOPS=4666, BW=18.2MiB/s (19.1MB/s)(182MiB/10001msec); 0 zone resets
    slat (nsec): min=1232, max=35353, avg=3432.50, stdev=1976.31
    clat (usec): min=247, max=7269, avg=423.68, stdev=181.11
     lat (usec): min=250, max=7271, avg=427.11, stdev=181.02
    clat percentiles (usec):
     |  1.00th=[  285],  5.00th=[  302], 10.00th=[  314], 20.00th=[  330],
     | 30.00th=[  351], 40.00th=[  367], 50.00th=[  379], 60.00th=[  400],
     | 70.00th=[  424], 80.00th=[  494], 90.00th=[  594], 95.00th=[  660],
     | 99.00th=[  898], 99.50th=[ 1319], 99.90th=[ 2147], 99.95th=[ 3228],
     | 99.99th=[ 6194]
   bw (  KiB/s): min=16912, max=19198, per=100.00%, avg=18676.85, stdev=513.96, samples=20
   iops        : min= 4228, max= 4799, avg=4669.10, stdev=128.50, samples=20
  lat (usec)   : 250=0.01%, 500=80.68%, 750=17.31%, 1000=1.20%
  lat (msec)   : 2=0.69%, 4=0.08%, 10=0.03%
  cpu          : usr=7.90%, sys=12.21%, ctx=36727, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,46674,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=87.7MiB/s (92.0MB/s), 87.7MiB/s-87.7MiB/s (92.0MB/s-92.0MB/s), io=877MiB (920MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=18.2MiB/s (19.1MB/s), 18.2MiB/s-18.2MiB/s (19.1MB/s-19.1MB/s), io=182MiB (191MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=4/111994, sectors=32/2457936, merge=0/173940, ticks=4/10669, in_queue=10672, util=27.78%
```

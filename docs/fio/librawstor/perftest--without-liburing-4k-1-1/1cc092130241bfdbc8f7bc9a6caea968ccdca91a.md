[&lt; back](..)

# perftest--without-liburing-4k-1-1

2025-09-03 21:22:31

refs/heads/feat/ci

[1cc0921](https://github.com/rawstor/librawstor/commit/1cc092130241bfdbc8f7bc9a6caea968ccdca91a)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10790: Wed Sep  3 21:22:30 2025
  read: IOPS=5915, BW=23.1MiB/s (24.2MB/s)(231MiB/10001msec)
    slat (nsec): min=50, max=24085, avg=154.20, stdev=166.71
    clat (usec): min=37, max=34406, avg=71.42, stdev=253.07
     lat (usec): min=37, max=34407, avg=71.57, stdev=253.07
    clat percentiles (usec):
     |  1.00th=[   52],  5.00th=[   56], 10.00th=[   58], 20.00th=[   61],
     | 30.00th=[   64], 40.00th=[   66], 50.00th=[   68], 60.00th=[   70],
     | 70.00th=[   73], 80.00th=[   76], 90.00th=[   82], 95.00th=[   89],
     | 99.00th=[  112], 99.50th=[  126], 99.90th=[  172], 99.95th=[  219],
     | 99.99th=[ 3163]
   bw (  KiB/s): min=21304, max=25760, per=100.00%, avg=23664.00, stdev=1191.12, samples=20
   iops        : min= 5326, max= 6440, avg=5916.00, stdev=297.78, samples=20
  write: IOPS=5897, BW=23.0MiB/s (24.2MB/s)(230MiB/10001msec); 0 zone resets
    slat (nsec): min=70, max=23735, avg=207.71, stdev=215.36
    clat (usec): min=45, max=25782, avg=94.48, stdev=165.54
     lat (usec): min=45, max=25782, avg=94.68, stdev=165.54
    clat percentiles (usec):
     |  1.00th=[   74],  5.00th=[   79], 10.00th=[   81], 20.00th=[   84],
     | 30.00th=[   87], 40.00th=[   89], 50.00th=[   92], 60.00th=[   94],
     | 70.00th=[   96], 80.00th=[   99], 90.00th=[  106], 95.00th=[  115],
     | 99.00th=[  147], 99.50th=[  169], 99.90th=[  255], 99.95th=[  285],
     | 99.99th=[ 1188]
   bw (  KiB/s): min=21064, max=25736, per=100.00%, avg=23592.00, stdev=1092.09, samples=20
   iops        : min= 5266, max= 6434, avg=5898.00, stdev=273.02, samples=20
  lat (usec)   : 50=0.22%, 100=89.50%, 250=10.20%, 500=0.06%, 750=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 50=0.01%
  cpu          : usr=7.67%, sys=32.17%, ctx=118229, majf=0, minf=278
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=59160,58980,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=23.1MiB/s (24.2MB/s), 23.1MiB/s-23.1MiB/s (24.2MB/s-24.2MB/s), io=231MiB (242MB), run=10001-10001msec
  WRITE: bw=23.0MiB/s (24.2MB/s), 23.0MiB/s-23.0MiB/s (24.2MB/s-24.2MB/s), io=230MiB (242MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/241, sectors=0/236704, merge=0/980, ticks=0/1773, in_queue=1778, util=0.33%
```

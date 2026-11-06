[&lt; back](..)

# perftest-ost-4k-2-1

2026-11-06 23:04:11

refs/heads/docs-index-diagram

[a969a97](https://github.com/rawstor/librawstor/commit/a969a974c6a92eaa81fcdfc7edcacef1a0134cab)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15532: Fri Nov  6 23:03:39 2026
  read: IOPS=39.4k, BW=154MiB/s (162MB/s)(1540MiB/10001msec)
    slat (nsec): min=601, max=45926, avg=1179.60, stdev=677.40
    clat (usec): min=20, max=954, avg=48.92, stdev=12.71
     lat (usec): min=21, max=955, avg=50.10, stdev=12.78
    clat percentiles (usec):
     |  1.00th=[   22],  5.00th=[   29], 10.00th=[   35], 20.00th=[   42],
     | 30.00th=[   45], 40.00th=[   46], 50.00th=[   47], 60.00th=[   50],
     | 70.00th=[   54], 80.00th=[   58], 90.00th=[   65], 95.00th=[   71],
     | 99.00th=[   86], 99.50th=[   92], 99.90th=[  106], 99.95th=[  113],
     | 99.99th=[  130]
   bw (  KiB/s): min=128456, max=170012, per=100.00%, avg=157819.45, stdev=11908.02, samples=20
   iops        : min=32114, max=42503, avg=39454.70, stdev=2977.03, samples=20
  lat (usec)   : 50=59.75%, 100=40.05%, 250=0.20%, 750=0.01%, 1000=0.01%
  cpu          : usr=17.42%, sys=55.59%, ctx=171671, majf=0, minf=2766
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=394362,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15535: Fri Nov  6 23:03:39 2026
  write: IOPS=4088, BW=16.0MiB/s (16.7MB/s)(160MiB/10001msec); 0 zone resets
    slat (nsec): min=1182, max=39123, avg=3957.84, stdev=1722.78
    clat (usec): min=303, max=3957, avg=483.60, stdev=128.62
     lat (usec): min=307, max=3960, avg=487.56, stdev=128.50
    clat percentiles (usec):
     |  1.00th=[  338],  5.00th=[  359], 10.00th=[  371], 20.00th=[  396],
     | 30.00th=[  412], 40.00th=[  429], 50.00th=[  449], 60.00th=[  469],
     | 70.00th=[  510], 80.00th=[  578], 90.00th=[  635], 95.00th=[  693],
     | 99.00th=[  832], 99.50th=[  930], 99.90th=[ 1631], 99.95th=[ 2114],
     | 99.99th=[ 3261]
   bw (  KiB/s): min=15679, max=16984, per=100.00%, avg=16361.15, stdev=348.94, samples=20
   iops        : min= 3919, max= 4246, avg=4090.25, stdev=87.31, samples=20
  lat (usec)   : 500=68.01%, 750=29.68%, 1000=1.89%
  lat (msec)   : 2=0.36%, 4=0.05%
  cpu          : usr=5.59%, sys=11.50%, ctx=38873, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,40888,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=154MiB/s (162MB/s), 154MiB/s-154MiB/s (162MB/s-162MB/s), io=1540MiB (1615MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=16.0MiB/s (16.7MB/s), 16.0MiB/s-16.0MiB/s (16.7MB/s-16.7MB/s), io=160MiB (167MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=3/101973, sectors=24/2250488, merge=0/159430, ticks=4/12464, in_queue=12468, util=31.94%
```

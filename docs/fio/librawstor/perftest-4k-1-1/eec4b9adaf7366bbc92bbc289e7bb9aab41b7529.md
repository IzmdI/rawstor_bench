[&lt; back](..)

# perftest-4k-1-1

2025-09-09 20:06:20

refs/heads/feat/no_poll

[eec4b9a](https://github.com/rawstor/librawstor/commit/eec4b9adaf7366bbc92bbc289e7bb9aab41b7529)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=11288: Tue Sep  9 20:06:18 2025
  read: IOPS=6114, BW=23.9MiB/s (25.0MB/s)(239MiB/10001msec)
    slat (nsec): min=50, max=18675, avg=168.65, stdev=262.83
    clat (usec): min=37, max=26579, avg=67.89, stdev=173.06
     lat (usec): min=37, max=26579, avg=68.06, stdev=173.06
    clat percentiles (usec):
     |  1.00th=[   50],  5.00th=[   54], 10.00th=[   56], 20.00th=[   59],
     | 30.00th=[   61], 40.00th=[   63], 50.00th=[   66], 60.00th=[   68],
     | 70.00th=[   71], 80.00th=[   74], 90.00th=[   80], 95.00th=[   86],
     | 99.00th=[  100], 99.50th=[  108], 99.90th=[  127], 99.95th=[  147],
     | 99.99th=[  338]
   bw (  KiB/s): min=22280, max=28016, per=100.00%, avg=24461.20, stdev=1449.72, samples=20
   iops        : min= 5570, max= 7004, avg=6115.30, stdev=362.43, samples=20
  write: IOPS=6094, BW=23.8MiB/s (25.0MB/s)(238MiB/10001msec); 0 zone resets
    slat (nsec): min=70, max=15890, avg=227.39, stdev=198.99
    clat (usec): min=54, max=29983, avg=92.33, stdev=236.61
     lat (usec): min=54, max=29983, avg=92.55, stdev=236.61
    clat percentiles (usec):
     |  1.00th=[   71],  5.00th=[   76], 10.00th=[   78], 20.00th=[   82],
     | 30.00th=[   84], 40.00th=[   87], 50.00th=[   89], 60.00th=[   92],
     | 70.00th=[   94], 80.00th=[   97], 90.00th=[  103], 95.00th=[  110],
     | 99.00th=[  125], 99.50th=[  135], 99.90th=[  161], 99.95th=[  239],
     | 99.99th=[ 2900]
   bw (  KiB/s): min=22576, max=27344, per=100.00%, avg=24381.20, stdev=1408.75, samples=20
   iops        : min= 5644, max= 6836, avg=6095.30, stdev=352.19, samples=20
  lat (usec)   : 50=0.61%, 100=91.70%, 250=7.66%, 500=0.02%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 10=0.01%, 50=0.01%
  cpu          : usr=6.42%, sys=34.56%, ctx=122249, majf=0, minf=283
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=61153,60953,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=23.9MiB/s (25.0MB/s), 23.9MiB/s-23.9MiB/s (25.0MB/s-25.0MB/s), io=239MiB (250MB), run=10001-10001msec
  WRITE: bw=23.8MiB/s (25.0MB/s), 23.8MiB/s-23.8MiB/s (25.0MB/s-25.0MB/s), io=238MiB (250MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/198, sectors=0/37848, merge=0/1206, ticks=0/244, in_queue=256, util=0.27%
```

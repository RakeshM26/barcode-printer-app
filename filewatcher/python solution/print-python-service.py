import os
import time
import platform

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

def print_prn_file(path):
    try:
        with open(path, 'rb') as f:
            data = f.read()

        if platform.system() == 'Windows':
            import win32print

            printer = win32print.OpenPrinter("YOUR_PRINTER_NAME")
            handle = win32print.StartDocPrinter(printer, 1, {"DocumentName": os.path.basename(path)})
            win32print.StartPagePrinter(handle)
            win32print.WritePrinter(handle, data)
            win32print.EndPagePrinter(handle)
            win32print.EndDocPrinter(handle)
            win32print.ClosePrinter(printer)
        elif platform.system() == 'Linux':
            import cups

            connection = cups.Connection()
            printers = connection.getPrinters()
            default_printer = printers.get(connection.getDefault())
            job_id = connection.printFile(default_printer["name"], path, "PRN File", {})
            connection.waitForCompletion(job_id)
        else:
            raise Exception("Unsupported operating system")

        print(f"Printed PRN file: {path}")
    except Exception as e:
        print(f"Error printing PRN file: {e}")

class MyHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return
        if event.src_path.endswith('.prn'):
            print_prn_file(event.src_path)

if __name__ == "__main__":
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path="path/to/your/folder", recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
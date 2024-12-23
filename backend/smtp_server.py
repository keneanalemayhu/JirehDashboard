import asyncore
from smtpd import SMTPServer

class DebuggingServer(SMTPServer):
    def process_message(self, peer, mailfrom, rcpttos, data, **kwargs):
        print(f'Receiving message from: {peer}')
        print(f'Message addressed from: {mailfrom}')
        print(f'Message addressed to: {rcpttos}')
        print(f'Message length: {len(data)}')
        print('Message content:')
        print(data.decode('utf-8'))
        return

server = DebuggingServer(('localhost', 1025), None)
print('Starting SMTP debugging server on localhost:1025')
try:
    asyncore.loop()
except KeyboardInterrupt:
    print('\nSMTP debugging server stopped')

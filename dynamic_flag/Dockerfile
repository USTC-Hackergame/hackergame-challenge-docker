FROM debian:11
RUN apt update && apt -y upgrade && \
    apt install -y xinetd python3-openssl docker.io && \
    rm -rf /var/lib/apt/lists/*
COPY xinetd /etc/xinetd.d/ctf
COPY front.py /
COPY cert.pem /
CMD ["xinetd", "-dontfork"]

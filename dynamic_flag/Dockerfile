FROM debian:12
RUN apt update && apt -y upgrade && \
    apt install --no-install-recommends -y xinetd python3-nacl docker.io && \
    rm -rf /var/lib/apt/lists/*
COPY xinetd /etc/xinetd.d/ctf
COPY front.py /
COPY pubkey /
CMD ["xinetd", "-dontfork"]

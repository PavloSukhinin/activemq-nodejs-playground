FROM apache/activemq-classic:5.17.6

COPY ./broker.config.xml /opt/apache-activemq/conf/activemq.xml

